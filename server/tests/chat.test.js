const assert = require('assert').strict;
const chatService = require('../service/chat');
require("dotenv").config()
const mongoose = require("mongoose");
const {
    usersToCreateChat,
    lightUsers
} = require("./testData");
const {
    filterUser
} = require("./utilsTest");

const chatController = require("../controllers/chat");

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})

describe("chat test", function () {
    let newChatId = null;

    after(async () => await chatService.deleteChat(newChatId))

    it("Create new chat", async function () {
        const beforeChatCount = await chatService.getChatsLength();
        newChatId = await chatService.createChat(usersToCreateChat);
        const afterChatCount = await chatService.getChatsLength();
        assert.strictEqual(afterChatCount - beforeChatCount, 1);
    });

    it("Create new message", async function () {
        const beforeChatCount = await chatService.getMessagesLength();
        await chatService.createMessage(usersToCreateChat[0], newChatId, "text", "test");
        const afterChatCount = await chatService.getMessagesLength();
        assert.strictEqual(afterChatCount - beforeChatCount, 1);
    });

    it("Get users for chat", async () => {
        const res = await chatService.findUserForChat(newChatId);
        assert.deepStrictEqual(res, lightUsers);
    })

    it("Get users ids for chat", async () => {
        const res = await chatService.getUsersIdsForChat(newChatId);
        assert.deepStrictEqual(res, usersToCreateChat);
    })

    it("Get chats for user", async () => {
        const chats = await chatService.findChatsForUser(usersToCreateChat[0])
        let isNewChatFinded = false;
        chats.forEach(chat => {
            if (chat.id === newChatId)
                isNewChatFinded = true;
        })
        assert.strictEqual(isNewChatFinded, true);
    })

    it("Get messages for chat", async () => {
        const messages = await chatService.getMessagesForChat(newChatId);
        assert.strictEqual(messages.length, 1);
    })

    it("Get chat by id", async () => {
        const chat = await chatService.findChatById(newChatId);
        assert.strictEqual(chat.id, newChatId);
        assert.strictEqual(chat.lastMessage, "test");
        assert.deepStrictEqual(chat.users, lightUsers);
    })

    it("Check is user in a chat", async () => {
        const res = await chatController.checkIsUserInChat(usersToCreateChat[0], newChatId);
        assert.strictEqual(res, true);
    })

    it("Check is user in a chat (user not in chat)", async () => {
        const res = await chatController.checkIsUserInChat(usersToCreateChat[0], "1241243523");
        assert.strictEqual(res, false);
    })

    it("Check is users have chat", async()=>{
        const res = await chatController.checkIsUsersHaveChat(usersToCreateChat[0], usersToCreateChat[1]);
        assert.strictEqual(res, true);
    })

    it("Check is users have chat(if hasn't chat)", async()=>{
        const res = await chatController.checkIsUsersHaveChat(usersToCreateChat[0], "1241243523");
        assert.strictEqual(res, false);
    })

});