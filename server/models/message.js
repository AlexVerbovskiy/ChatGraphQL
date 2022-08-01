const {Schema, model} = require('mongoose');

const MessageSchema = new Schema({
    idSender:{type: String, required: true},
    idChat:{type: String, required: true},
    type:{type: String, default: "text"},
    value:{type: String},
    sendedAt:{ type: String, required: true}
})

module.exports = model("Message", MessageSchema);