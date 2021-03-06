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
    movies: [{type : mongoose.Schema.ObjectId, ref : 'MovieModel'}],
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
        movies: this.movies
    }
}

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

UserSchema.methods.findMost = function () {
    
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

    const getAverage = function (arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        const average = total / arr.length
        return Math.floor(average);
    }

    const mapValues = function (values) {
        const valuesArray = [].concat.apply([], values);
        return valuesArray;
    }
    
    const genres = this.movies.map((item) => item.genre);
    const genreArray = mapValues(genres);
    const genreArrayNames = genreArray.map((genre) => genre.name);
    const genreArrayIds = genreArray.map((genre) => genre.id);
    const userGenres = getFrequency(genreArrayNames);
    const userGenreId = getFrequency(genreArrayIds);


    const companies = this.movies.map((item) => item.production_companies);
    const companyArray = mapValues(companies);
    const companyArrayNames = companyArray.map((company) => company.name);
    console.log('kiwi company names', companyArrayNames)
    const companyArrayIds = companyArray.map((company) => company.id)
    const userCompanyIds = getFrequency(companyArrayIds);
    const userCompanies = getFrequency(companyArrayNames);

    const countries = this.movies.map((item) => item.production_countries);
    const countryArray = mapValues(countries);
    const countryArrayNames = countryArray.map((country) => country.name);
    const userCountries = getFrequency(countryArrayNames);

    const budgets = this.movies.map((item) => item.budget);
    const userBudgets = getAverage(mapValues(budgets));

    const revenues = this.movies.map((item) => item.revenue);
    const userRevenues = getAverage(mapValues(revenues));

    const runtimes = this.movies.map((item) => item.runtime);
    const userRuntimes = getAverage(mapValues(runtimes));

    const ratings = this.movies.map((item) => item.rating);
    const userRatings = getAverage(mapValues(ratings));

    const yearArray = this.movies.map((item) => item.year);
    const formatYears = yearArray.map((year) => year.substring(0, 3))
    const userYearArray = formatYears.map((year) => year + '0');
    const userYears = getFrequency(userYearArray);

    console.log('kiwi years returns', userYearArray)
    console.log('kiwi most common year is', userYears)
    
    return {
        genres: userGenres,
        genreId: userGenreId,
        companies: userCompanies,
        companyIds: userCompanyIds,
        countries: userCountries,
        years: userYears,
        budget: userBudgets,
        revenue: userRevenues,
        runtime: userRuntimes,
        rating: userRatings
    }
}

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
}

const UserModel = mongoose.model('UserModel', UserSchema);


const email = 'test@test.com';
const username = 'Tester';
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