//const Message = require('../models/tempMessage');
const {
    withFilter
} = require('graphql-subscriptions');

const {
    PubSub
} = require('graphql-subscriptions');

const pubSub = new PubSub();

/*module.exports = {
    Mutation: {
        async createMessage(_, {
            messageInput: {
                nameSender,
                value
            }
        }) {
            const newMessage = new Message({
                nameSender,
                value
            })

            const res = await newMessage.save();

            pubSub.publish('MESSAGE_CREATED', {
                messageCreated: {
                    nameSender,
                    value
                }
            })

            return {
                id: res.id,
                ...res._doc
            }
        }

    },
    Subscription: {
        messageCreated: {
            subscribe: withFilter(
                () => pubSub.asyncIterator('MESSAGE_CREATED'),
                (payload, variables) => {
                    console.log(payload);
                    console.log(variables);
                    return true
                }, )
        }
    },
    Query: {
        async message(_, {
            id
        }) {
            return await Message.findById(id)
        },
        async messages(_) {
            return await Message.find()
        },
    }
}*/



const UserController = require('../controllers/user');
const ChatController = require('../controllers/chat');

module.exports = {
    Mutation: {
        async registration(_, {
            newUserInput
        }) {
            return await UserController.registration(newUserInput);
        },
        async login(_, {
            loginInput
        }) {
            return await UserController.login(loginInput);
        },
        async createChat(_, {
            idCreater,
            usersIds
        }) {
            const newChatId = await ChatController.createChat(usersIds);
            const chat = await ChatController.findChatById(newChatId);
            pubSub.publish('CHAT_CREATED',  {
                    chatCreated: {
                        shortChatInfo:{...chat},
                        idCreater
                    },
                    idCreater
                })
            return newChatId;
        },
        async createMessage(_, {
            messageInput
        }) {
            const newMessage = await ChatController.createMessage(messageInput);
            pubSub.publish('MESSAGE_CREATED', {
                messageCreated: newMessage
            })
            return newMessage.id;
        },
        async changeConnect(_, {
            idUser,
            isOnline
        }) {
            await UserController.updateOnline(idUser, isOnline);
            pubSub.publish('UPDATE_ONLINE', {
                updateOnline: {
                    idUser,
                    isOnline
                }
            })
            return true;
        },
        async changeTyping(_, {
            idChat,
            idUser,
            isTyping
        }) {
            pubSub.publish('UPDATE_TYPING', {
                updateTyping: {
                    idChat,
                    idUser,
                    isTyping
                }
            })
            return true;
        }
    },
    Query: {
        async getUsers(_) {
            return await UserController.getUsers();
        },
        async checkAuth(_, {
            userInfo
        }) {
            return await UserController.checkAuth(userInfo);
        },
        async usersForChat(_, {
            mess
        }) {
            return await UserController.findUsersForChatting(mess);
        },
        async userChats(_, {
            id
        }) {
            return await ChatController.getUserChats(id)
        },
        async chatMessages(_, {
            id
        }){
            return await ChatController.getMessagesForChat(id)
        }
    },
    Subscription: {
        chatCreated: {
            subscribe: withFilter(
                () => pubSub.asyncIterator('CHAT_CREATED'),
                (payload, variables) => {
                    const isUserInNewChat = payload.chatCreated.shortChatInfo.users.map(elem => elem.id).includes(variables.idUser);
                    if ( /*variables.idUser !== payload.idCreater &&*/ isUserInNewChat)
                        return true
                    return false
                }, )
        },
        messageCreated: {
            subscribe: withFilter(
                () => pubSub.asyncIterator('MESSAGE_CREATED'),
                async (payload, variables) => {
                    const isUserInChat = await ChatController.checkIsUserInChat(variables.idUser, payload.messageCreated.idChat);
                    if (isUserInChat)
                        return true
                    return false
                }, )
        },
        updateOnline: {
            subscribe: withFilter(
                () => pubSub.asyncIterator('UPDATE_ONLINE'),
                async (payload, variables) => {
                    const usersHaveChat = await ChatController.checkIsUsersHaveChat(variables.idUser, payload.updateOnline.idUser);
                    if (usersHaveChat)
                        return true
                    return false
                }, )
        },
        updateTyping: {
            subscribe: withFilter(
                () => pubSub.asyncIterator('UPDATE_TYPING'),
                async (payload, variables) => {
                    if (variables.idUser === payload.updateTyping.idUser || variables.idChat !== payload.updateTyping.idChat)
                        return false;
                    const isUserInChat = await ChatController.checkIsUserInChat(variables.idUser, payload.updateTyping.idChat);
                    if (isUserInChat)
                        return true
                    return false
                }, )
        },
    },
}