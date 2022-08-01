const {
    gql
} = require('apollo-server');
/*
module.exports = gql `
    type Message{
        nameSender: String
        value: String
        id: String
    }

    input MessageInput{
        nameSender: String
        value: String
    }

    type Query{
        message(id: ID!): Message!
        messages: [Message!]
    }

    type Mutation{
        createMessage(messageInput: MessageInput): Message!
    }

    type Subscription{
        messageCreated(name: String): Message
    }
`

*/

module.exports = gql `
    type User{
        id: String
        email: String
        password:String
        fullName:String
        phone:String
        salt:String
        isActiveted:Boolean
        activationLink:String
        avatarURL:String
        online:Boolean
    }

    type FilteredUserInfo{
        id: String
        email: String
        fullName:String
        phone:String
        avatarURL:String
        online:Boolean
        isActiveted:Boolean
        password: String
    }

    type LightUserInfo{
        id: String
        fullName: String
        avatarURL: String 
        online: Boolean
    }

    type ShortChatInfo{
        id: String
        users: [LightUserInfo]
        lastMessage: String
        lastMessageTime: String
    }

    type Message{
        id:String
        idSender:String
        idChat:String
        type:String
        value:String
        sendedAt: String
    }

    type userTyping{
        idChat: String
        isTyping:Boolean
        idUser: String
    }

    type userConnection{
        isOnline:Boolean
        idUser: String
    }

    type CreatedMessageInfo{
        shortChatInfo: ShortChatInfo
        idCreater: String
    }

    input MessageInput{
        idSender:String
        idChat:String
        type:String
        message:String
    }

    input LoginInput{
        email: String
        password:String
    }

    input NewUserInput{
        email: String
        password:String
        fullName:String
        phone:String
        avatarImgData:String
        avatarImgType:String
    }

    input CheckAuthInput{
        id:String
        hashedPassword:String
    }

    type Mutation{
        registration(newUserInput: NewUserInput):FilteredUserInfo
        login(loginInput: LoginInput):FilteredUserInfo
        createChat(idCreater:String,  usersIds:[String]):String
        createMessage(messageInput: MessageInput): String
        changeConnect(idUser:String, isOnline:Boolean):Boolean
        changeTyping(idChat:String, idUser:String, isTyping:Boolean):Boolean
    }

    type Query{
        getUsers: [FilteredUserInfo]
        checkAuth(userInfo:CheckAuthInput):FilteredUserInfo
        usersForChat(mess:String):[FilteredUserInfo]
        userChats(id:String): [ShortChatInfo]
        chatMessages(id:String):[Message]
    }

    type Subscription{
        chatCreated(idUser: String): CreatedMessageInfo
        messageCreated(idUser:String): Message
        updateOnline(idUser:String):userConnection
        updateTyping(idChat:String, idUser:String):userTyping
    }
`
/*
        Subscr{
         messageCreated(idUser: String, idChat: String): Message*/