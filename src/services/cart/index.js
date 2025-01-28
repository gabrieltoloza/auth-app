import { CartDao } from "../../dao/cart.dao.js";
import { CartRepository } from "./cart.repository.js";


export const CartService = new CartRepository(CartDao)