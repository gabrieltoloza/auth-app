import { UserDTO } from "../dto/user.dto.js";
import { mockProduct, mockUser } from "../module/mock-data.js";
import { authService } from "../services/auth/index.js";
import { PasswordResetService } from "../services/password-reset/index.js";
import { ProductService } from "../services/products/index.js";
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
            res.status(500).json({ status: false, error: error.message})
        }
    }


    // metodos Pre Entrega N°1

    static async insertMockUsers (req, res) {
        
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const resultStats = {
            ok: 0,
            error: 0
        }

        try {

            for(let i = 0;i < quantity; i++) {
                const result = await authService.createUser(mockUser())
                if(result instanceof Error) {
                    resultStats.error+= 1
                } else {
                    resultStats.ok+= 1
                }
            }

            if(resultStats.ok < 1) return res.status(400).json({ status: false, error: 'No se pudo agregar ningun usuario'})
                
            return resultStats.ok === parseInt(quantity)
                ? res.status(200).json({ status: true, result: `Se crearon ${resultStats.ok} usuarios`})
                : res.status(200).json({ 
                    status: true, 
                    result: `Se crearon ${resultStats.ok} usuarios, ${resultStats.error} no pudieron crearse`
                })

    
        } catch (error) {
            res.status(500).json({ status: false, error: error.message})
        }
    }


    static async getUsersMockWithDB (req, res) {
            
        try {

            const allUsers = await authService.getUsers()

            if (allUsers instanceof Error) return res.status(400).json({ message: "Ocurrio un error inesperado" });

            res.status(200).json({ status: true, result: allUsers })

            
        } catch (error) {
            res.status(500).json({ status: false, error: error.message})
        }
    }


    static async getMockUsers (req, res) {

        const { quantity } = req.body;
        const allMockProducts = []

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        try {

            for(let i = 0;i < quantity; i++) {
                allMockProducts.push(mockUser())
            }
            
            res.status(200).json({ status: true, result: allMockProducts })

        } catch (error) {
            res.status(500).json({ status: false, error: error.message})
        }
    }
}