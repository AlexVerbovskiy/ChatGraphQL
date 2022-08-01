const userFilter = (model, resetPass) => {
    return {
        email: model.email,
        id: model._id.toString(),
        isActiveted: model.isActiveted,
        fullName: model.fullName,
        phone: model.phone,
        password: resetPass ? "" : model.password,
        avatarURL: model.avatarURL,
        online: model.online
    }
}

const lightUserFilter = (model) => {
    return {
        id: model._id.toString(),
        fullName: model.fullName,
        avatarURL: model.avatarURL,
        online: model.online
    }
}

const usersFilter = (models, resetPass) => models.map(model => userFilter(model, resetPass));

module.exports = {
    userFilter,
    usersFilter,
    lightUserFilter
}