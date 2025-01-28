import { Router } from "express";
import { authorization } from "../middleware/authorization.js";
import { passportCall } from "../utils/passportCall.js";
import { ProductController } from "../controller/product.controller.js";

const router = Router();

// Usamos el middleware de JWT
router.use(passportCall('jwt'))

// Usuario permitido para "seller(por ende tambien un admin)"
router.get('/', authorization(['buyer', 'admin']), ProductController.getAllProducts)


// Endpoint para usuario "admin"
router.post('/', authorization(['admin']), ProductController.createProduct)
router.patch('/:pid', authorization(['admin']), ProductController.updateProduct)
router.delete('/:pid', authorization(['admin']), ProductController.deleteProduct)



export default router;