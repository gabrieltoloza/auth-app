import bcrypt from 'bcrypt';

// Funcion para crear el hash
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Funcion para comparar el hash cuando iniciamos sesion.
export const isValidHash = (user, password) => bcrypt.compareSync(password, user.password);