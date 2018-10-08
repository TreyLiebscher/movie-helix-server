'use strict';

const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: String,
    movieId: Number,
    hasPoster: Boolean,
    poster: String,
    year: String,
    genre : [],
    rating: Number,
    runtime: Number,
    budget: Number,
    revenue: Number,
    production_companies: [],
    production_countries: [],
    users: [{type: mongoose.Schema.ObjectId, ref : 'UserModel'}]  
})

MovieSchema.methods.serialize = function () {
    return {
        id: this._id,
        movieId: this.movieId,
        title: this.title,
        hasPoster: this.hasPoster,
        poster: this.poster,
        year: this.year,
        genre: this.genre,
        rating: this.rating,
        runtime: this.runtime,
        budget: this.budget,
        revenue: this.revenue,
        production_companies: this.production_companies,
        production_countries: this.production_countries,
        users: this.users
    }
}

const MovieModel = mongoose.model('MovieModel', MovieSchema);

module.exports = { MovieModel };