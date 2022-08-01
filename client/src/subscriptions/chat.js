import {
  gql
} from "@apollo/client";

export const SUBSCRIBE_CHAT_CREATED = gql `
subscription Subscription($idUser: String) {
    chatCreated(idUser: $idUser) {
      shortChatInfo {
        id
        users {
          id
          fullName
          avatarURL
          online
        }
        lastMessage
        lastMessageTime
      }
      idCreater
    }
  }
  `
export const SUBSCRIBE_MESSAGE_CREATED = gql `
  subscription Subscription($idUser: String) {
    messageCreated(idUser: $idUser) {
      idSender
      id
      idChat
      type
      value
      sendedAt
    }
  } `

export const SUBSCRIBE_ONLINE_UPDATE = gql `
  subscription Subscription($idUser: String) {
    updateOnline(idUser: $idUser) {
      isOnline
      idUser
    }
  }`

export const SUBSCRIBE_TYPING_UPDATE = gql `
  subscription Subscription($idChat: String, $idUser: String) {
    updateTyping(idChat: $idChat, idUser: $idUser) {
      idChat
      isTyping
      idUser
    }
  }`