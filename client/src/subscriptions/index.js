import {
    gql
} from "@apollo/client";

export const SUBSCRIBE_GET_MESSAGE = gql `
subscription Subscription($name:String) {
    messageCreated(name: $name) {
      nameSender
      value
      id
    }
  }
  `