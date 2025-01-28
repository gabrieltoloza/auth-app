import { OrderDao } from "../../dao/order.dao.js";
import { OrderRepository } from "./order.repository.js";


export const OrderService = new OrderRepository(OrderDao)