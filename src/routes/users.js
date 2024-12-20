import { Router } from "express";
import { generateToken } from "../utils/jwt-token.js";
import { authorization } from "../middleware/authorization.js";
import { passportCall } from "../utils/passportCall.js";




const router = Router();



router.post('/register', passportCall('register'), async (req, res) => {

    try {
        
        if(!req.user) return res.status(400).json({ message: "Register failed"});
        const token = generateToken(req.user);
        res.cookie('hashTomadorWeb', token, { httpOnly: true }).json({ message: "User register" });

    } catch (error) {
        console.error(error)
        res.status(400).json({ message: "Internal Server Error"})
    }
})



router.post('/login', passportCall('login'), async (req, res) => {

    try {
        
        if(!req.user) return res.status(400).json({ message: "Login failed"});
        const token = generateToken(req.user);
        console.log(req.user.bearer_token)
        res.cookie('hashTomadorWeb', token, { httpOnly: true }).json({ message: "Login Succefully"});

    } catch (error) {
        console.error(error)
        res.status(400).json({ message: "Internal Server Error"})
    }

})


router.get('/logout', (req, res) => {
    
    res.clearCookie('hashTomadorWeb').json({ message: "Logout succefully"})


})



router.get('/profile', passportCall('jwt'), authorization('seller'), (req, res) => {
    
    const payload = {
        first_name: req.user.first_name,
        last_name: req.user.last_name
    }

    res.status(200).json(payload);
})




export default router;