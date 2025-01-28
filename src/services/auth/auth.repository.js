



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