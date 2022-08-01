import {
  gql
} from "@apollo/client";

export const GET_USERS = gql `
query Query {
  getUsers {
    id
    email
    fullName
    phone
    isActivated
    avatarURL
    online
  }
}
`
export const CHECK_AUTH = gql `
query Query($userInfo: CheckAuthInput) {
  checkAuth(userInfo: $userInfo) {
    id
  }
}
`

export const USERS_FOR_CHAT = gql `
query Query($mess: String) {
  usersForChat(mess: $mess) {
    id
    fullName
    online
    avatarURL
  }
}`