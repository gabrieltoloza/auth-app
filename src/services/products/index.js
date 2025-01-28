import { ProductRepository } from "./products.repository.js";
import { ProductDao } from "../../dao/product.dao.js";


export const ProductService = new ProductRepository(ProductDao)