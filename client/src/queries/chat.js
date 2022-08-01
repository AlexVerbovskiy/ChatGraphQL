import {
  gql
} from "@apollo/client";

export const GET_CHATS_USER = gql `
query Query($userChatsId: String) {
    userChats(id: $userChatsId) {
      users {
        id
        fullName
        avatarURL
        online
      }
      id
      lastMessage
      lastMessageTime
    }
  }`

export const GET_MESSAGES_CHAT = gql `
  query Query($chatMessagesId: String) {
  chatMessages(id: $chatMessagesId) {
    id
    idSender
    idChat
    type
    value
    sendedAt
  }
}`