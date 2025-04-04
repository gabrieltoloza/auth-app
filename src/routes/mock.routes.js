import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";



const router = Router()



router.post('/dataMock', AuthController.insertMockData) // <-- Mock de usuarios y productos
router.get('/get-users-with-db', AuthController.getUsersMockWithDB)
router.get('/get-users-mock', AuthController.getMockUsers)



export default router;