const assert = require('assert').strict;
const userService = require('../service/user');
require("dotenv").config()
const mongoose = require("mongoose");
const {
    testingUser,
    createdUser,
    loginUser
} = require("./testData");
const {
    filterUser
} = require("./utilsTest");

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})

describe("registration user test", function () {
    let createdId = null;

    after(async () => await userService.deleteUser(createdId))
    it("Create new user", async function () {
        const data = await userService.registration(testingUser.email, testingUser.password, testingUser.fullName, testingUser.phone, true);
        const user = filterUser(data.user);
        createdId = data.user.id;
        assert.deepStrictEqual(user, createdUser);

    });

    it("Try to create new user with email which in DB", async function () {
        const error = new Error("The user with email: test@gmail.com is registered");
        let gettedError = null;
        try {
            await userService.registration(testingUser.email, testingUser.password, testingUser.fullName, testingUser.phone, true);
        } catch (err) {
            gettedError = err
        }
        assert.deepStrictEqual(gettedError, error);

        /*assert.throws(async() => {
            await userService.registration(testingUser.email, testingUser.password, testingUser.fullName, testingUser.phone);
        }, error);*/
    });

});

describe("login user test", function () {

    it("Logging user", async function () {
        const email = "cofeek1@gmail.com";
        const password = "11";
        const data = await userService.login(email, password);
        assert.deepStrictEqual(data.user, loginUser);
    });

    it("Incorrect login user", async function () {
        const email = "cofeek12@gmail.com";
        const password = "11";
        const error = new Error('User not found!');
        let gettedError = null;
        try {
            await userService.login(email, password);
        } catch (err) {
            gettedError = err
        }
        assert.deepStrictEqual(gettedError, error);
    });

    it("Incorrect password user", async function () {
        const email = "cofeek1@gmail.com";
        const password = "1";
        const error = new Error('Password incorrect!');
        let gettedError = null;
        try {
            await userService.login(email, password);
        } catch (err) {
            gettedError = err
        }
        assert.deepStrictEqual(gettedError, error);
    });

});

describe('helper functions user test ', function () {
    const password = "$2b$08$s0qbXcxX1c4Eop8n8/IDmeQa2li1sRApZbhusNgfQxTSvHKPJOfdO";
    const id = "626a7fa08159fca365ea3b31";
    const testEmail = "cofeek1@gmail.com";

    after(async () => await userService.updateOnline(id, false))

    it("Find user by id and password", async function () {
        const user = await userService.findUserByIdAndPassword(id, password);
        assert.deepStrictEqual(user.user, loginUser);
    });

    it("Find user with incorrect id by id and password", async function () {
        const error = new Error("User wasn't found!");
        let gettedError = null;
        try {
            await userService.findUserByIdAndPassword("626a7fa08159fca365ea3b35", "asdas");
        } catch (err) {
            gettedError = err
        }
        assert.deepStrictEqual(gettedError, error);
    });

    it("Get Users for create new chat", async function () {
        const users = await userService.getUsersByNameOrEmailOrPhone(testEmail);
        assert.deepStrictEqual(users.users, [{
            ...loginUser,
            password: ""
        }]);
    });

    it("Update online user", async function () {
        const userOnline = await userService.updateOnline(id, true);
        const exampleOnline = {
            ...loginUser,
            online: true
        };
        assert.deepStrictEqual(userOnline, exampleOnline);
        const userOffline = await userService.updateOnline(id, false);
        const exampleOffline = {
            ...loginUser,
            online: false
        };
        assert.deepStrictEqual(userOffline, exampleOffline);
    })

    it("Update online user with incorrect id", async function () {
        const error = new Error("User wasn't found!");
        let gettedError = null;
        try {
            await userService.updateOnline("626a7fa08159fca365ea3b35", true);
        } catch (err) {
            gettedError = err
        }
        assert.deepStrictEqual(gettedError, error);
    });
})