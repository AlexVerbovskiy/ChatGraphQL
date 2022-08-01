const path = require('path');
const chatServices = require('../service/chat');

const getAvatar = (req, res) => res.sendFile(path.join(__dirname, "../media/userAvatars/" + req.params["link"]));

const getMediaMessage = (req, res) => {
    let hrefMedia = "../media/";
    switch (req.params["type"]) {
        case "image":
            hrefMedia += "image";
            break;
        case "video":
            hrefMedia += "video";
            break;
        case "audio":
            hrefMedia += "audio";
            break;
        default:
            break;
    }
    res.sendFile(path.join(__dirname, hrefMedia + "/" + req.params["link"]));
}

const getUserChats = async (id) => await chatServices.findChatsForUser(id);

const createChat = async (mess) => await chatServices.createChat(mess);

const findChatById = async (id) => await chatServices.findChatById(id)

const createMessage = async (message) => await chatServices.createMessage(message.idSender, message.idChat, message.type, message.message);

const checkIsUserInChat = async (idUser, idChat) => {
    const usersIds = await chatServices.getUsersIdsForChat(idChat);
    return usersIds.includes(idUser)
}

const checkIsUsersHaveChat = async (idUser1, idUser2) => {
    const chats = await chatServices.findChatsForUser(idUser1);
    const users = [];
    chats.forEach(chat => users.push(...chat.users));
    const ids = users.map(user => user.id);
    return ids.includes(idUser2);
}

const getMessagesForChat = async (id) => await chatServices.getMessagesForChat(id);

module.exports = {
    getAvatar,
    getMediaMessage,
    getUserChats,
    createChat,
    findChatById,
    createMessage,
    checkIsUserInChat,
    checkIsUsersHaveChat,
    getMessagesForChat
};