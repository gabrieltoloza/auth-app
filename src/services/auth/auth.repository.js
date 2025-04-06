export class AuthRepository {
    #daos

    constructor(daos) {
        // El parametro daos es un objeto con los 2 daos de usuarios (admin, buyer)
        this.#daos = daos
    }

    async getUserByEmailAndRole(email, role) {
        const dao = this.#daos[role]
        if (!dao) throw new Error("Rol Invalido")
        return await dao.getByEmail(email)
    }

    async getUsers() {
        const users = []

        try {
            const adminUsers = await this.#daos["admin"].getAdmins()
            const buyers = await this.#daos["buyer"].getBuyers()

            if (adminUsers instanceof Error || buyers instanceof Error) throw new Error("Rol Invalido")

            adminUsers.forEach(admin => users.push(admin))
            buyers.forEach(buyer => users.push(buyer))

            return users
        } catch (error) {
            return error
        }
    }

    async createUser(userData) {
        const {role} = userData
        const dao = this.#daos[role]

        if (!dao) throw new Error("Rol Invalido")

        if (role === "admin") {
            return await dao.createAdmin(userData)
        } else {
            return await dao.createBuyer(userData)
        }
    }

    async insertManyUsers(userData) {
        const admins = []
        const buyers = []

        userData.forEach(user => {
            user.role === "admin" ? admins.push(user) : buyers.push(user)
        })

        try {
            let result = {
                success: true,
                insertedCount: 0
            }

            // Realizar ambas inserciones en paralelo
            const insertPromises = []

            if (admins.length > 0) {
                insertPromises.push(
                    this.#daos.admin.insertManyAdmins(admins).then(adminResult => {
                        if (adminResult instanceof Error) {
                            result.success = false
                        } else {
                            const adminCount = Array.isArray(adminResult) ? adminResult.length : adminResult.insertedCount || 0
                            result.insertedCount += adminCount
                        }
                    })
                )
            }

            if (buyers.length > 0) {
                insertPromises.push(
                    this.#daos.buyer.insertManyBuyer(buyers).then(buyerResult => {
                        if (buyerResult instanceof Error) {
                            result.success = false
                        } else {
                            const buyerCount = Array.isArray(buyerResult) ? buyerResult.length : buyerResult.insertedCount || 0
                            result.insertedCount += buyerCount
                        }
                    })
                )
            }

            // Esperar a que ambas operaciones terminen
            await Promise.all(insertPromises)
            return result
        } catch (error) {
            return error
        }
    }
}
