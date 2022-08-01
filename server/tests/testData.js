const testingUser = {
    email: "test@gmail.com",
    password: "testtest",
    fullName: "test test",
    phone: "test number"
}

const createdUser = {
    email: "test@gmail.com",
    isActiveted: false,
    fullName: "test test",
    phone: "test number",
    avatarURL: "",
    online: false
}

const loginUser = {
    email: 'cofeek1@gmail.com',
    id: '626a7fa08159fca365ea3b31',
    isActiveted: true,
    fullName: 'alex',
    phone: '1312',
    password: '$2b$08$s0qbXcxX1c4Eop8n8/IDmeQa2li1sRApZbhusNgfQxTSvHKPJOfdO',
    avatarURL: '626924dad949e919dab21dd4.png',
    online: false
}

const lightUsers = [{
    id: '626a7fa08159fca365ea3b31',
    fullName: 'alex',
    avatarURL: '626924dad949e919dab21dd4.png',
    online: false
}, {
    id: "626924dad949e919dab21dd4",
    fullName: "alex",
    avatarURL: "626924dad949e919dab21dd4.png",
    online: true
}]

const usersToCreateChat = ["626a7fa08159fca365ea3b31", "626924dad949e919dab21dd4"]

module.exports = {
    loginUser,
    createdUser,
    testingUser,
    usersToCreateChat,
    lightUsers
}