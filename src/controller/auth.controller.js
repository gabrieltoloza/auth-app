import { UserDTO } from "../dto/user.dto.js";
import { PasswordResetService } from "../services/password-reset/index.js";
import { generateToken } from "../utils/jwt-token.js";


export class AuthController {

    static async registerUser(req, res) {
        try {
            
            if(!req.user || req.user instanceof Error) return res.status(400).json({ status: false, message: "Error al registrar usuario"});

            const token = generateToken(req.user); // <-- Generacion del token
            const timeExpired = 6 * 60 * 60 * 1000 // <-- Tiempo de expiracion del token

            res.cookie('hashTomadorWeb', token, { httpOnly: true, maxAge: timeExpired })
                .json({status: true, message: "Usuario registrado", info: req.info }).status(200);

        } catch (error) {
            console.error(error)
            res.status(400).json({ message: "Internal Server Error"})
        }
    }


    static async loginUser(req, res) {

        try {
        
            if(!req.user) return res.status(400).json({ status: false, message: "Login failed", info: req.info});

            const token = generateToken(req.user); // <-- Generacion del token
            const timeExpired = 6 * 60 * 60 * 1000 // <-- Tiempo de expiracion del token

            res.cookie('hashTomadorWeb', token, { httpOnly: true, maxAge: timeExpired })
                .json({status: true, message: "Login OK", info: req.info })
                .status(200);
    
        } catch (error) {
            console.error(error)
            res.status(400).json({ message: "Internal Server Error"})
        }
    }


    static async logOut(req, res) {
        
        res.clearCookie('hashTomadorWeb').json({ message: "Logout succefully"}).status(200)
    }



    static async getUserData(req, res) {

        try {
            
            if(!req.user) return res.status(400).json({ status: false, message: req.info });

            // "DTO" APLICADO AQUI - "DTO" APLICADO AQUI
            const payload = req.user
            const user = new UserDTO(payload)
        
            res.status(200).json({ status: true, payload: user});
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ status: false, message: req.info });
        }
    }

    static async resetPassword (req, res) {

        const { email } = req.body

        try {
            
            const result = await PasswordResetService.createPasswordReset(email)

            if(!result instanceof Error ) return new Error("Error al intentar recuperar contraseña")

            res.status(400).json({ result: result })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ status: false, error: error.message})
        }
    }


    static async updatePassword(req, res) {

        const { email, resetToken, password } = req.body;
    
        if (!password || !email || !resetToken) {
            return res.status(400).json({ message: "Missing required fields" });
        }
    

        try {

            const result = await PasswordResetService.updatePassword(email, resetToken, password)

            if(result instanceof Error) res.status(400).json({ status: false, error: result.message})
       
            res.status(200).json({ status: true, result: result})

    
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ status: false, error: error.message})
        }
    }
}