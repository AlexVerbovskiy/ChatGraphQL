const filterUser = (model) => ({
    email: model.email,
    isActiveted: model.isActiveted,
    fullName: model.fullName,
    phone: model.phone,
    avatarURL: model.avatarURL,
    online: model.online
});

module.exports = {
    filterUser
}