export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) {
            // Le dejo la validacion al controlador, el passportconfig me setea la info que debe llegar
            return res.status(401).json({ status: false, message: "No autorizado" });
        }
        console.log(req.user)
        const userRole = Array.isArray(req.user.role) ? req.user.role[0] : req.user.role;
        const middlewareRoles = Array.isArray(role) ? role : [role];

        const hasRole = middlewareRoles.includes(userRole);

        if (hasRole) {
            return next();
        }

        return res.status(403).json({ status: false, message: "No tiene permisos" });
    };

};
