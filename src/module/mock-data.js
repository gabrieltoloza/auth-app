import { faker } from "@faker-js/faker"
import { createHash } from "../utils/funcionesHash.js"


export const mockUser = () => {

    return {
        id: faker.database.mongodbObjectId(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: createHash('coder123'),
        role: faker.helpers.arrayElement(['admin', 'buyer']),
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

