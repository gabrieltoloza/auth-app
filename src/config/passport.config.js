import passport from "passport";
import local from 'passport-local';
import jwt,{ ExtractJwt } from 'passport-jwt';
import { createHash, isValidHash } from "../utils/funcionesHash.js";
import { config } from "../utils/utilities.js";
import { authService } from "../services/auth/index.js";




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
                return done({error});                
            }
        }
    ))


    // Passport para regitrar un nuevo usuario.
    passport.use('register', new LocalStrategy(

        {
            passReqToCallback: true, // Permite que el objeto req sea pasado a la función de verificación
            usernameField: 'email'   // Especifica que el campo 'email' contiene el nombre de usuario
        },
        async(req, username, password, done ) => {

            
            const { firstName, lastName, role = 'buyer' } = req.body; // <-- Si no se pasa este parametro por defecto sera "buyer"

            if (!firstName || !lastName || !username || !password) {
                return done(null, false, { message: "Faltan parametros en la peticion" });
            }

            if (role !== "buyer" && role !== 'admin') {
                return done(null, false, { message: " Rol invalido, debe ser 'buyer' o 'admin' " });
            }

            try {

                const userExists = await authService.getUserByEmailAndRole(username, role)
                

                if (userExists) return done(null, false, { message: "El usuario ya existe" });

                const newUser = {
                    email: username,
                    password: createHash(password),
                    firstName,
                    lastName,
                    role,
                };

                const userCreated = await authService.createUser(newUser)


                return done(null, userCreated);
            } catch (error) {
                return done(error, false);
            }
        }
    ))


    passport.use('login', new LocalStrategy(
        
        {
            usernameField: 'email',
            passReqToCallback: true,
        },
        async(req, username, password, done) => {

            const { role = 'buyer' } = req.body // <-- Si no se pasa este parametro por defecto sera "buyer"

            if (!username || !username) {
                return done(null,false, "Faltan parametros en la peticion")
            }

            if(role !== "buyer" && role !== "admin"){
                done(null, false, { message: " Rol invalido, debe ser 'buyer' o 'admin' " } )
            }

            try {

                const user = await authService.getUserByEmailAndRole(username, role)
                
                if(!user) return done(null, false, { message: "Usuario no encontrado" });
                if(!isValidHash(user, password)) return done(null, false, { message: "Contraseña incorrecta" });

                // Si encuentra el user, y la contraseña coincide, llega a este punto
                return done(null, user)

            } catch (error) {
                return done(error)            
            }
        }
    ))


}


export default initializePassport;