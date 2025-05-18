import mongoose from "mongoose";
import { expect } from "chai";
import { describe, before, after, beforeEach, it } from "mocha";
import supertest from "supertest";
import dotenv from "dotenv"
import { mockProduct } from "../src/module/mock-data.js";
import OrderModel from '../src/models/order.model.js';


dotenv.config();

const requester = supertest("http://localhost:8080");

// Token JWT para autenticacion
let adminToken
let buyerToken
let adminCookie
let buyerCookie

// ID de prueba
let testCartId
let testBuyerId
let testProductId

describe("Test funcional para el router carrito", function() {
    this.timeout(15000) //timeout general
    
    // Conectar a la base de datos antes de todas las pruebas
    before(async function() {
        this.timeout(15000) // timeout para mongo

        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log("Conectado a la base de datos para pruebas")


            
            const adminLoginResponse = await requester
                .post("/api/sessions/login")
                .send({
                    email: 'admin1@gmail.com',
                    password: 'admin123',
                    role: "admin"
                })

            adminCookie = adminLoginResponse.headers['set-cookie'][0]
            console.log({adminCookie})
            
            
            const buyerLoginResponse = await requester
                .post("/api/sessions/login")
                .send({
                    email: 'buyer@gmail.com',
                    password: 'buyer123',
                    role: "buyer"
                })
            
            buyerCookie = buyerLoginResponse.headers['set-cookie'][0]
            console.log({buyerCookie})



            
            const userResponse = await requester
                .get("/api/sessions/profile")
                .set("Cookie", buyerCookie)
            
            testBuyerId = userResponse.body.payload.email
            console.log("Deberia obtener el email del usuario: ",testBuyerId)

        } catch (error) {
            console.error("Error en la configuracion del test:", error.message)
            throw error;
        }


    })

    // Desconectar a la base de datos despues de todas las pruebas
    after(async function() {
        // Limpiar datos de prueba
        try {

            
            // 1. Eliminar todas las órdenes creadas para el comprador de prueba
            if (testBuyerId) {
                await OrderModel.deleteMany({ buyer: testBuyerId });
            }


            if(testCartId) {
                await requester
                    .delete(`/api/carts/${testCartId}`)
                    .set("Cookie", adminCookie)
            }


            if (testProductId) {
                await requester
                    .delete(`/api/products/${testProductId}`)
                    .set("Cookie", adminCookie)
            }

            if (testCartId) {
                await requester
                    .delete(`/api/carts/${testCartId}`)
                    .set("Cookie", adminCookie)
            }

            await mongoose.connection.close()
            console.log("Cerrando conexion a base de datos mongo.");
            
            
        } catch (error) {
            console.error("Error al cerrar la conexión:", error);
        }
    })


    // Test básico para verificar la conexión a MongoDB
    it("Debería estar conectado a MongoDB correctamente", function() {
        expect(mongoose.connection.readyState).to.equal(1); // 1 = conectado
    });

    // Test básico para verificar que el login como admin funcionó
    it("Debería tener una cookie de administrador válida", function() {
        expect(adminCookie).to.not.be.null;
    });

    // Test básico para verificar que el login como buyer funcionó
    it("Debería tener una cookie de comprador válida", function() {
        expect(buyerCookie).to.not.be.null;
    });

    // Test básico para verificar que puede crear un producto
    it("Debería poder crear un producto de prueba", async function() {
        if (!adminCookie) {
            this.skip(); // Saltamos el test si no hay cookie
        }

        try {
            const productResponse = await requester
                .post("/api/products")
                .set("Cookie", adminCookie)
                .send(mockProduct());

            
            
            expect(productResponse.status).to.equal(200);
            expect(productResponse.body).to.have.property("status", true);
            expect(productResponse.body).to.have.property("result");
            expect(productResponse.body.result).to.have.property("_id");
            
            // Guardamos el ID para usarlo más adelante
            testProductId = productResponse.body.result._id;
            
        } catch (error) {
            console.error("Error al crear producto:", error.message);
            throw error;
        }
    });

    // Test básico para verificar que puede obtener el perfil de usuario
    it("Debería poder obtener el perfil del comprador", async function() {
        if (!buyerCookie) {
            this.skip(); // Saltamos el test si no hay cookie
        }

        try {
            const userResponse = await requester
                .get("/api/sessions/profile")
                .set("Cookie", buyerCookie);
            
            expect(userResponse.status).to.equal(200);
            expect(userResponse.body).to.have.property("status", true);
            expect(userResponse.body).to.have.property("payload");
            
            // Guardamos los datos del usuario para usarlo más adelante
            testBuyerId = userResponse.body.payload._id
            
        } catch (error) {
            console.error("Error al obtener perfil:", error.message);
            throw error;
        }
    });

    // Eliminamos el producto creado en las pruebas
    it("Debería poder eliminar el producto de prueba", async function() {
        if (!adminCookie || !testProductId) {
            this.skip(); // Saltamos el test si no hay cookie o producto
        }

        try {
            const response = await requester
                .delete(`/api/products/${testProductId}`)
                .set("Cookie", adminCookie);
            
            expect(response.status).to.equal(200);
            
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
        }
    });



    describe("GET /api/carts", function() {
            it("Debería manejar correctamente la consulta de carritos", async function() {
                const response = await requester
                    .get("/api/carts")
                    .set("Cookie", adminCookie);
                
                // Si no hay carritos, es válido un 400 con mensaje específico
                if (response.status === 400) {
                    expect(response.body.error).to.equal("No hay carritos en la base de datos");
                } else {
                    // Si hay carritos, debe ser 200 con array
                    expect(response.status).to.equal(200);
                    expect(response.body.result).to.be.an("array");
                }
            });
            
            it("Debería rechazar la petición si el usuario no es admin", async function() {
                const response = await requester
                    .get("/api/carts")
                    .set("Cookie", buyerCookie)
                
                expect(response.status).to.equal(403)
            })
        })
        
        describe("POST /api/carts/:bid", function() {
            it("Debería crear un carrito para un comprador", async function() {

                // Crear un producto primero
                const productResponse = await requester
                    .post("/api/products")
                    .set("Cookie", adminCookie)
                    .send(mockProduct());
                
                testProductId = productResponse.body.result._id;


                const response = await requester
                    .post(`/api/carts/${testBuyerId}`)
                    .set("Cookie", buyerCookie)
                    .send({
                        products: [{
                            product: testProductId,
                            quantity: 2
                        }]
                    })
                
                expect(response.status).to.equal(200)
                expect(response.body.status).to.be.true
                expect(response.body.result).to.have.property("buyer")
                expect(response.body.result).to.have.property("products")
                
                // Guardamos el ID del carrito para pruebas posteriores
                testCartId = response.body.result._id
            })
            
            it("Debería rechazar la creación si el producto no existe", async function() {
                const response = await requester
                    .post(`/api/carts/${testBuyerId}`)
                    .set("Cookie", buyerCookie)
                    .send({
                        products: [{
                            product: "65f5a93a1234567890abcdef", // ID inválido
                            quantity: 2
                        }]
                    })
                
                
                expect(response.status).to.equal(400)
                expect(response.body.status).to.be.false
            })
        })
        
        describe("GET /api/carts/:cid", function() {
            it("Debería obtener un carrito por su ID", async function() {
                // Asumiendo que testCartId ya existe de pruebas anteriores
                const response = await requester
                    .get(`/api/carts/${testCartId}`)
                    .set("Cookie", buyerCookie)
                
                expect(response.status).to.equal(200)
                expect(response.body.status).to.be.true
                expect(response.body.result).to.have.property("_id")
                expect(response.body.result).to.have.property("buyer")
                expect(response.body.result).to.have.property("products")
            })
        })
        
        describe("PATCH /api/carts/:cid", function() {
            it("Debería actualizar un producto en el carrito", async function() {
                const response = await requester
                    .patch(`/api/carts/${testCartId}`)
                    .set("Cookie", buyerCookie)
                    .send({
                        product: testProductId,
                        quantity: 3
                    })
                
                expect(response.status).to.equal(200)
                expect(response.body.status).to.be.true
                
                // Verificar que la cantidad se actualizó
                const updatedProductInCart = response.body.result.products.find(
                    p => p.product._id === testProductId
                )
                expect(updatedProductInCart.quantity).to.equal(3)
            })
        })
        
        describe("PATCH /api/carts/:bid/purchase", function() {
            it("Debería procesar la compra de un carrito", async function() {
                const response = await requester
                    .patch(`/api/carts/${testBuyerId}/purchase`)
                    .set("Cookie", adminCookie)
                    .send({
                        status: "confirmed"
                    })


                expect(response.status).to.equal(200)
                expect(response.body.status).to.be.true
                expect(response.body.result).to.have.property("purchaseItems")
                expect(response.body.result).to.have.property("order")
                expect(response.body.result.order).to.have.property("status", "confirmed")
            })
            
            it("Debería rechazar una compra con status inválido", async function() {
                const response = await requester
                    .patch(`/api/carts/${testBuyerId}/purchase`)
                    .set("Cookie", adminCookie)
                    .send({
                        status: "invalid_status"
                    })
                
                
                
                expect(response.status).to.not.equal(200)
            })
        })
        
        describe("DELETE /api/carts/:cid", function() {
            it("Debería eliminar un carrito si el usuario es admin", async function() {
                const response = await requester
                    .delete(`/api/carts/${testCartId}`)
                    .set("Cookie", adminCookie)
                
                expect(response.status).to.equal(200)
                expect(response.body.status).to.be.true
                
                // Limpiar el testCartId ya que lo acabamos de eliminar
                testCartId = null
            })
            
            it("Debería rechazar la eliminación si el usuario no es admin", async function() {
                // Primero creamos un nuevo carrito para la prueba
                const createResponse = await requester
                    .post(`/api/carts/${testBuyerId}`)
                    .set("Cookie", buyerCookie)
                    .send({
                        products: [{
                            product: testProductId,
                            quantity: 1
                        }]
                    })
                
                const newCartId = createResponse.body.result._id
                
                // Intentamos eliminar con un usuario buyer
                const response = await requester
                    .delete(`/api/carts/${newCartId}`)
                    .set("Cookie", buyerCookie)
                
                expect(response.status).to.equal(403)
                
                // Limpiamos el carrito creado usando admin
                await requester
                    .delete(`/api/carts/${newCartId}`)
                    .set("Cookie", adminCookie)
            })
        })


})