import mongoose from "mongoose"
import {AdminDao} from "../src/dao/admin.dao.js"
import {expect} from "chai"
import {describe} from "mocha"

mongoose.connect("mongodb://localhost:27017/tercer_modulo")

describe("Test AdminDao ", function () {
    before(function () {
        this.adminDao = AdminDao
    })

    beforeEach(function () {
        mongoose.connection.collections.admin.drop()
        this.timeout(500)
    })

    it("El dao debe poder obtener todos los usuarios en formato 'array'", async function () {
        const result = await this.adminDao.getAdmins()
        expect(Array.isArray(result)).to.ok
    })

    it("El dao debe agregar un usuario correctamente a la base de datos", async function () {
        let userMock = {
            firstName: "Gabriel",
            lastName: "Toloza",
            email: "gabriel@gmail.com",
            password: "12345"
        }

        const result = await this.adminDao.createAdmin(userMock)
        expect(result).to.be.ok
        expect(result).to.have.property("firstName", "Gabriel")
    })
})
