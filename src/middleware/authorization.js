export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) {
            // Le dejo la validacion al controlador, el passportconfig me setea la info que debe llegar
            return res.status(401).json({ status: false, message: "No autorizado" });
        }

        const userRole = req.user.role;
        const middlewareRoles = Array.isArray(role) ? role : [role];

        const hasRole = middlewareRoles.includes(userRole);

        if (hasRole) {
            return next();
        }

        return res.status(403).json({ status: false, message: "No tiene permisos" });
    };

};
