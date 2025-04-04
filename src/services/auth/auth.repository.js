



export class AuthRepository {
    #daos;

    constructor(daos) {
        // El parametro daos es un objeto con los 2 daos de usuarios (admin, buyer)
        this.#daos = daos
    }

    async getUserByEmailAndRole (email, role) {
        const dao = this.#daos[role];
        if(!dao) throw new Error("Rol Invalido")
        return await dao.getByEmail(email)
    }


    async getUsers () {
        
        const users = [];

        try {

            const adminUsers = await this.#daos['admin'].getAdmins();
            const buyers = await this.#daos['buyer'].getBuyers();
    
            if(adminUsers instanceof Error || buyers instanceof Error) throw new Error ("Rol Invalido");
    
            adminUsers.forEach(admin => 
                users.push(admin)
            )
            buyers.forEach(buyer => {
                users.push(buyer)
            })

            return users;

        } catch (error) {
            return error
        }

    }

    async createUser (userData) {
        const { role } = userData;
        const dao = this.#daos[role]

        if(!dao) throw new Error ("Rol Invalido");

        if(role === "admin") {
            return await dao.createAdmin(userData)
        } else{
            return await dao.createBuyer(userData)
        }
    }
}