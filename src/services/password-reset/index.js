import { PasswordResetDao } from "../../dao/password.reset.dao.js";
import { PasswordResetRepository } from "./password-reset.repository.js";



export const PasswordResetService = new PasswordResetRepository(PasswordResetDao)