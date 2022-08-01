import {
  gql
} from "@apollo/client";

export const CREATE_CHAT = gql `
  mutation Mutation($idCreater: String, $usersIds: [String]) {
    createChat(idCreater: $idCreater, usersIds: $usersIds)
  }
  `

export const CREATE_MESSAGE = gql `
  mutation Mutation($messageInput: MessageInput) {
    createMessage(messageInput: $messageInput)
  }
  `

export const CHANGE_TYPING = gql `
  mutation Mutation($idChat: String, $idUser: String, $isTyping: Boolean) {
    changeTyping(idChat: $idChat, idUser: $idUser, isTyping: $isTyping)
  }
  `

  export const CHANGE_ONLINE = gql `
  mutation Mutation($idUser: String, $isOnline: Boolean) {
    changeConnect(idUser: $idUser, isOnline: $isOnline)
  }
  `