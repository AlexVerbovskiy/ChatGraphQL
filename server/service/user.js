const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const mailService = require('../service/mail');
const {
    userFilter,
    usersFilter
} = require('../utils/filterObjDb')
const ApiError = require('../utils/error')


class User {
    async registration(email, password, fullName, phone, isTest = false) {
        const candidate = await UserModel.findOne({
            email
        });
        if (candidate)
            throw new Error('The user with email: ' + email + ' is registered');

        const salt = Math.floor(Math.random() * 10001);
        const hashPassword = await bcrypt.hash(password + salt, 8);
        let activationLink = await bcrypt.hash(email, 8);
        activationLink = activationLink.replaceAll("/", "-");
        const user = await UserModel.create({
            email,
            password: hashPassword,
            fullName,
            phone,
            salt,
            activationLink
        });
        if (!isTest)
            await mailService.SendActivationMail(email, process.env.API_URL 
                + '/api/activate/' + activationLink);
        const shortUserInfo = userFilter(user);
        return {
            user: shortUserInfo
        }
    }

    async updateAvatar(id, href) {
        const user = await UserModel.findById(id);
        if (user) {
            user.avatarURL = href;
            await user.save();
            const shortUserInfo = userFilter(user);
            return shortUserInfo;
        }
        return null;
    }

    async activate(link) {
        const user = await UserModel.findOne({
            activationLink: link
        });
        if (!user)
            throw ApiError.BedRequest('Incorrect link!')

        user.isActiveted = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({
            email
        });
        if (!user)
            throw new Error('User not found!');

        const isPassCorrect = await bcrypt.compare(password + user.salt, user.password);
        if (!isPassCorrect)
            throw new Error('Password incorrect!');

        const filterUserDb = userFilter(user);
        return {
            user: filterUserDb
        };
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async findUserByIdAndPassword(id, password) {
        const user = await UserModel.findOne({
            _id: id,
            password: password
        });
        if (!user)
            throw new Error("User wasn't found!")

        const filterUserDb = userFilter(user);
        return {
            user: filterUserDb
        };
    }

    async getUsersByNameOrEmailOrPhone(value) {
        const users = await UserModel.find({
            $or: [{
                    fullName: new RegExp(value)
                },
                {
                    email: new RegExp(value)
                },
                {
                    phone: new RegExp(value)
                }
            ]
        }).limit(20);
        const filterUsers = usersFilter(users, true);
        return {
            users: filterUsers
        };
    }

    async updateOnline(id, value) {
        const user = await UserModel.findById(id);
        if (!user)
            throw new Error("User wasn't found!")

        user.online = value;
        user.save();
        return userFilter(user);
    }

    async deleteUser(id) {
        const user = await UserModel.findById(id);
        user.remove();
    }
}

module.exports = new User();