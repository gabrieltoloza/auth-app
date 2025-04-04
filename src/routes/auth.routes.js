import { Router } from "express";
import { authorization } from "../middleware/authorization.js";
import { passportCall } from "../utils/passportCall.js";
import { AuthController } from "../controller/auth.controller.js";




const router = Router();


router.post('/register', passportCall('register'), AuthController.registerUser)

router.post('/login', passportCall('login'), AuthController.loginUser)

router.get('/logout', AuthController.logOut)

router.get('/profile', passportCall('jwt'), AuthController.getUserData)

//Reset Password

router.post('/reset-password', AuthController.resetPassword)
router.post('/update-password', AuthController.updatePassword) // <-- solo para el buyer, ya que el admin se contempla como superusuario



export default router;