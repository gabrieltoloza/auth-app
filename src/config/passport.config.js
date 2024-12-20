import passport from "passport";
import local from 'passport-local';
import jwt,{ ExtractJwt } from 'passport-jwt';
import { createHash, isValidHash } from "../utils/funcionesHash.js";
import usersModel from "../models/users.model.js";
import { config } from "../utils/utilities.js";


const LocalStrategy = local.Strategy;
const JWTStragey = jwt.Strategy;



const cookieExtractor = (req) => {
    return req && req.cookies ? req.cookies["hashTomadorWeb"] : null;
}



const initializePassport = () => {


    passport.use('jwt', new JWTStragey(

        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.SECRET_JWT
        },
        async(jwt_payload, done) => {
            try {
                return done(null, jwt_payload.user);
            } catch (error) {
                return done(error);                
            }
        }
    ))


    // Passport para regitrar un nuevo usuario.
    passport.use('register', new LocalStrategy(

        {
            passReqToCallback: true, // Permite que el objeto req sea pasado a la función de verificación
            usernameField: 'seller_name'   // Especifica que el campo 'email' contiene el nombre de usuario
        },
        async(req, username, password, done ) => {

            
            const { code_list, email, order, role, bearer_token } = req.body;


            try {
                
                
                // Verificamos si el usuario ya existe
                const user = await usersModel.findOne({ seller_name: username })
                if(user) return done(null, false, { message: "El usuario ya existe" })
                
                // Preparamos el nuevo usuario si pasa la anterior validacion
                const newUser = {
                    seller_name: username,
                    email: email,
                    code_list: code_list,
                    password: createHash(password),
                    order: order,
                    role: role,
                    bearer_token: bearer_token
                }

                // Creamos el usuario y lo devolvemos
                const result = await usersModel.create(newUser);
                return done(null, result)

            } catch (error) {   
                return done(error)
            }
        }
    ))



    passport.use('login', new LocalStrategy(
        
        {
            usernameField: 'seller_name'
        },
        async(username, password, done) => {
            
            try {
                
                const user = await usersModel.findOne({ seller_name: username });
                if(!user) return done(null, false);
                if(!isValidHash(user, password)) return done(null, false);

                // Si encuentra el user, y la contraseña coincide, llega a este punto
                return done(null, user)

            } catch (error) {
                return done(error)            
            }
        }
    ))


}


export default initializePassport;