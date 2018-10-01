'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String,
        required: true
    },
    username: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    helix: {
        genres: [],
        years: [],
        ratings: [],
        runtimes: [],
        budgets: [],
        revenues: [],
        companies: [],
        countries: []
    }
}, {
    timestamps: {
        createdAt: 'createdAt'
    }
});

UserSchema.methods.serialize = function () {

    return {
        id: this._id,
        email: this.email,
        username: this.username,
        helix: this.helix
    };
}

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
}

const UserModel = mongoose.model('UserModel', UserSchema);


const email = 'test@test.com';
const username = 'tester';
const password = 'password123';

const testUtilCreateUser = async () => {
    await UserModel.remove({});
    return UserModel.hashPassword(password).then(hashedPassword => {
        return UserModel.create({
            email,
            username,
            password: hashedPassword
        });
    });
}

module.exports = {
    UserModel,
    testUtilCreateUser
};