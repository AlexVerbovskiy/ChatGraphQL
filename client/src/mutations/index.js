import {
  gql
} from "@apollo/client";

export const CREATE_NEW_MESSAGE = gql `
mutation Mutation($messageInput: MessageInput) {
  createMessage(messageInput: $messageInput) {
    value, nameSender
  }
}
`