import {
    gql
  } from "@apollo/client";
  
  export const REGISTRY_USER = gql `
  mutation Mutation($newUserInput: NewUserInput) {
    registration(newUserInput: $newUserInput) {
      id
      email
      phone
      fullName
      avatarURL
      online
      isActiveted
    }
  }
  `
  export const LOGIN_USER = gql `
  mutation Mutation($loginInput: LoginInput) {
    login(loginInput: $loginInput) {
      id
      email
      phone
      fullName
      avatarURL
      online
      isActiveted
      password
    }
  }
  `