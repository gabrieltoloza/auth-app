import { AdminDao } from "../../dao/admin.dao.js";
import { BuyerDao } from "../../dao/buyer.dao.js";
import { AuthRepository } from "./auth.repository.js";

// Este objeto son los "DAO" que necesita el Repositorio que maneja la autenticacion.
const DAOS = {
    admin: AdminDao,
    buyer: BuyerDao,
}

export const authService = new AuthRepository(DAOS)