export const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documumentación de proyecto coder tercer modulo",
            description: "Api funcional a un proyecto integrador"
        }
    },
    apis: [`./src/documentacion/**/*.yml`]
}
