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
        movieIds: [],
        genres: [],
        years: [],
        ratings: [],
        runtimes: [],
        budgets: [],
        revenues: [],
        companies: [],
        countries: []
    },
    genres: [],
}, {
    timestamps: {
        createdAt: 'createdAt'
    }
});

UserSchema.methods.serialize = function () {

    const getFrequency = function (arr) {
        let obj = {}, mostFreq = 0, which = [];
  
        arr.forEach(ea => {
          if (!obj[ea]) {
            obj[ea] = 1;
          } else {
            obj[ea]++;
          }
      
          if (obj[ea] > mostFreq) {
            mostFreq = obj[ea];
            which = [ea];
          } else if (obj[ea] === mostFreq) {
            which.push(ea);
          }
        });
      
        return which;
    }


    return {
        id: this._id,
        email: this.email,
        username: this.username,
        helix: this.helix,
        genres: getFrequency(this.helix.genres)
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