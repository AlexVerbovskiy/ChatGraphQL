const ChatModel = require('../models/chat');
const ChatsUsersModel = require('../models/chatsUsers');
const MessageModel = require('../models/message');
const UserModel = require('../models/user');
const {
    lightUserFilter
} = require('../utils/filterObjDb');
const {writeMediaMessage} = require('../utils/writerMedia');

class Chat {
    async createChat(usersIdArray) {
        const newChat = await ChatModel.create({});
        const newChatId = newChat._id.toString();
        for (let i = 0; i < usersIdArray.length; i++) {
            await ChatsUsersModel.create({
                idUser: usersIdArray[i],
                idChat: newChatId
            })
        }
        return newChatId
    }

    async getChatsLength (){
        const chats = await ChatModel.find({});
        return chats.length;
    }

    async getMessagesLength (){
        const messages = await MessageModel.find({});
        return messages.length;
    }

    async deleteChat (idChat) {
        const chat = await ChatModel.findById(idChat);
        chat?.remove();
        //await ChatsUsersModel.deleteMany({idChat})
        //await MessageModel.deleteMany({idChat})
        return true;
    }

    async createMessage(idSender, idChat, type, value) {

        const sendedAt = /*getActualDate()*/ (new Date()).toString();
        if (type === "text") {
            const newMess = await MessageModel.create({
                idSender,
                idChat,
                type,
                value,
                sendedAt
            });
            return newMess;
        }

        const newMess = await MessageModel.create({
            idSender,
            idChat,
            type,
            value:"",
            sendedAt
        });
        const href = writeMediaMessage(value, type, newMess._id);
        return await this.updateMessage(newMess._id, href);
    }

    async getMessagesForChat(idChat) {
        const messages = await MessageModel.find({
            idChat
        });
        return messages;
    }

    async updateMessage(id, value) {
        const message = await MessageModel.findById(id);
        message.value = value;
        await message.save();
        return message;
    }

    async findChatById(idChat) {
        try {

            const usersId = await ChatsUsersModel.find({
                idChat
            }, {
                idUser: 1,
                _id: 0
            })

            const users = [];
            for (let j = 0; j < usersId.length; j++) {
                const {
                    idUser
                } = usersId[j];
                const user = await UserModel.findById(idUser)
                const filterUser = lightUserFilter(user);
                users.push(filterUser);
            }

            const lastMessage = await MessageModel.findOne({
                idChat: idChat
            }, {
                value: 1,
                type: 1,
                sendedAt: 1,
                _id: 0
            }, {
                sort: {
                    sendedAt: -1
                }
            })

            const lastMessageValue = lastMessage ? lastMessage.type === "text" ? lastMessage.value : lastMessage.type : null;

            const chat = {
                id: idChat,
                users,
                lastMessage: lastMessageValue,
                lastMessageTime: lastMessage ?.sendedAt
            }
            return chat;


        } catch (e) {
            console.log(e)
        }
    }

    async findChatsForUser(id) {
        const chatsTemp = await ChatsUsersModel.find({
            idUser: id
        }, {
            _id: 0,
            idChat: 1
        });

        const idsChats = chatsTemp.map(elem => elem.idChat);
        const generatedQueries = idsChats.map(idChat => {
            const mainQuery = async () => {
                const usersId = await ChatsUsersModel.find({
                    idChat,
                    idUser: {
                        $ne: id
                    }
                }, {
                    idUser: 1,
                    _id: 0
                })
                const generatedUsersQueries = usersId.map(userId => {
                    const query = async () => {
                        const uId = userId.idUser;
                        const user = await UserModel.findById(uId);
                        const filterUser = lightUserFilter(user);
                        return filterUser;
                    }
                    return query;
                })
                const users = await Promise.all(generatedUsersQueries.map(query => query()))

                const lastMessage = await MessageModel.findOne({
                    idChat: idChat
                }, {
                    value: 1,
                    type: 1,
                    sendedAt: 1,
                    _id: 0
                }, {
                    sort: {
                        sendedAt: -1
                    }
                })

                const lastMessageValue = lastMessage ? lastMessage.type === "text" ? lastMessage.value : lastMessage.type : null;

                const chat = {
                    id: idChat,
                    users,
                    lastMessage: lastMessageValue,
                    lastMessageTime: lastMessage ?.sendedAt
                }

                return chat;
            }
            return mainQuery;
        })
        const res = await Promise.all(generatedQueries.map(query => query()));
        return res;
    }

    async findUserForChat(idChat) {
        const usersId = await ChatsUsersModel.find({
            idChat
        }, {
            idUser: 1,
            _id: 0
        })
        const users = [];
        for (let j = 0; j < usersId.length; j++) {
            const {
                idUser
            } = usersId[j];
            const user = await UserModel.findById(idUser)
            const filterUser = lightUserFilter(user);
            users.push(filterUser);
        }
        return users;
    }

    async getUsersIdsForChat(idChat) {
        const usersId = await ChatsUsersModel.find({
            idChat
        }, {
            idUser: 1,
            _id: 0
        })
        const res = usersId.map(user => user.idUser);
        return res;
    }
}

module.exports = new Chat();