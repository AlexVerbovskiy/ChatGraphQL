const userService = require('../service/user');
const {
    writeImage
} = require('../utils/writerMedia')

const getUsers = async () => await userService.getAllUsers();

const activate = async (req, res) => {
    try {
        const link = req.params.link;
        await userService.activate(link);
        return res.redirect(process.env.CLIENT_URL)
    } catch (error) {
        console.log(error)
    }
}

const login = async ({
    email,
    password
}) => {
    const userData = await userService.login(email, password);
    return userData.user;
}

const registration = async ({
    email,
    password,
    fullName,
    phone,
    avatarImgData,
    avatarImgType
}) => {
    const correctTypes = ["svg", "gif", "jpeg", "jpg", "pjpeg", "png"];

    if (avatarImgType && !correctTypes.includes(avatarImgType))
        throw new Error("Incorrect page type");

    let userData = await userService.registration(email, password, fullName, phone);
    if (avatarImgData) {
        const href = writeImage(avatarImgData, avatarImgType, userData.user.id);
        const user = await userService.updateAvatar(userData.user.id, href);
        userData = {
            ...userData,
            user
        }
    }
    return userData.user;
}

const checkAuth = async ({id, hashedPassword}) => {
    const data = await userService.findUserByIdAndPassword(id, hashedPassword);
    return data.user
}

const findUsersForChatting = async (mess) => {
    const {
        users
    } = await userService.getUsersByNameOrEmailOrPhone(mess);
    return users;
}

const updateOnline = async (id, isOnline) => {
    const user = await userService.updateOnline(id, isOnline);
    return user;
}

module.exports = {
    registration,
    getUsers,
    activate,
    login,
    checkAuth,
    findUsersForChatting,
    updateOnline
}