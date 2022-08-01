const {Schema, model} = require('mongoose');

const ChatUserSchema = new Schema({
    idUser: {type: String, required: true},
    idChat: {type: String, required: true}
})

module.exports = model("ChatUser", ChatUserSchema);