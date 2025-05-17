import winston from "winston"

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "blue",
        debug: "white"
    }
}

// Configurar colores para los niveles
winston.addColors(customLevelOptions.colors)

export const customLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        // Transporte para consola
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        // Transporte para archivo
        new winston.transports.File({
            filename: "./error.logs",
            level: "warning",
            format: winston.format.simple()
        })
    ]
})

//! PROBAR LOS LOGS DE ERROR Y WARNING
