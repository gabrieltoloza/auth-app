import { Router } from "express";
import { authorization } from "../middleware/authorization.js";
import { passportCall } from "../utils/passportCall.js";
import { CartController } from "../controller/cart.controller.js";


const router = Router()

router.use(passportCall('jwt'))


router.get('/', authorization(['admin']), CartController.getCarts)

router.get('/:cid', authorization(['admin', 'buyer']), CartController.getById)

router.post('/:bid', authorization(['buyer']), CartController.createCart)
router.patch('/:cid', authorization(['buyer']), CartController.updateCart) // <-- posible modificaciones como sumar o restar cantidades

router.delete('/:cid', authorization(['admin']), CartController.deleteCart)



router.patch('/:bid/purchase', authorization(['admin']), CartController.resolve)




export default router;