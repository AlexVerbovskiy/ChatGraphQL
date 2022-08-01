const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email:{type: String, unique: true, required: true},
    password:{type: String, required: true},
    fullName:{type: String, required: true},
    phone:{type: String, required: true},
    salt:{type:Number, required: true},
    isActiveted:{type: Boolean, default: false},
    activationLink:{type: String},
    avatarURL:{type: String, default: ''},
    online:{type:Boolean, default: false}
});

module.exports = model("User", UserSchema);