import {faker} from "@faker-js/faker"
import {createHash} from "../utils/funcionesHash.js"

/*
    Creo el hash asi para cumplir la consigna sino el tiempo de respuesta del 
    endpoint se eleva 0.5s por usuario mockeado al usar la funcionHash, 
    en 1000 usuarios tarda alrededor de 50 segundos en responder.
    De esta manera de puede mockear hasta
*/

const DEFAULT_PASSWORD_HASH = createHash("coder123")

export const mockUser = () => {
    return {
        id: faker.database.mongodbObjectId(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: DEFAULT_PASSWORD_HASH,
        role: faker.helpers.arrayElement(["admin", "buyer"]),
        orders: []
    }
}

export const mockProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int(),
        category: faker.commerce.productAdjective(),
        createdAt: faker.date.anytime()
    }
}

export const generateMockUsers = quantity => {
    let users = []

    for (let i = 0; i < quantity; i++) {
        users.push(mockUser())
    }

    return users
}

export const generaMockProducts = quantity => {
    let products = []

    for (let i = 0; i < quantity; i++) {
        products.push(mockProduct())
    }

    return products
}
