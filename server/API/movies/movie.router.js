const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jsonParser = bodyParser.json();

const tryCatch = require('../../helpers').expressTryCatchWrapper;
const getFields = require('../../helpers').getFieldsFromRequest;

const config = require('../../../config');
const { localStrategy, jwtStrategy } = require('../../../auth/strategies');

const { UserModel } = require('../users/user.model');
const { MovieModel } = require('./movie.model');

passport.use(localStrategy);
passport.use(jwtStrategy);

const router = express.Router();

const localAuth = passport.authenticate('local', {
    session: false,
    failWithError: false
});

const jwtAuth = passport.authenticate('jwt', {
    session: false
});

// POST/PUT - Save a Movie //
async function saveMovie(req, res) {
    const existingRecord = await MovieModel.findOne({title: req.body.title});
    console.log('kiwi exist returns', existingRecord)
    if (existingRecord === null) {
        let movie = new MovieModel(req.body);

        movie.save(function(err, movie) {
            UserModel.findById(req.body.user, function(err, user) {
                user.movies.push(movie);
                user.save(function(err) {
                    UserModel.findById(req.body.user)
                    .populate('movies')
                    .exec(function (err, movies) {
                        res.json({
                            profile: movies.serialize(),
                            preferences: movies.findMost()
                        })
                    })
                })
            })
        })

    } else {

        const existingSavedMovie = await UserModel.findById(req.body.user);

        const exist = existingSavedMovie.movies;

        const modifyExisting = (arr, existing) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == existing) {
                    
                    return res.json({
                        message: 'Already Saved!'
                    })
                } 
            }
        
            MovieModel.findById(existingRecord.id, function(err, movie) {
                movie.users.push(req.body.user);
                movie.save(function(err, movie) {
                    UserModel.findById(req.body.user, function(err, user) {
                        user.movies.push(movie);
                        user.save(function(err) {
                            UserModel.findById(req.body.user)
                            .populate('movies')
                            .exec(function (err, movies) {
                                res.json({
                                    profile: movies.serialize(),
                                    preferences: movies.findMost()
                                })
                            })
                        })
                    })
                })
            })
        }

        return modifyExisting(exist, existingRecord.id)
    }
}

router.post('/save', tryCatch(saveMovie));
// // //

// DELETE/PUT - Delete a Movie //
async function deleteMovie(req, res) {
    console.log('kiwi', req.body.title)
    const movieToDelete = await MovieModel.findOne({title: req.body.title});
    
    console.log('kiwi movieToDelete returns', movieToDelete)
    if (movieToDelete === null) {
        res.json({
            message: `Movie ${req.body.title} does not exist`
        })
    } else {
        // Reusable function for splicing out user/movie ids
        const removeItem = (arr, item) => {
            const index = arr.indexOf(item);

            if (index !== -1) {
                arr.splice(index, 1);
            } else {
                return;
            }
        }

        MovieModel.findById(movieToDelete.id, function(err, movie) {
            removeItem(movie.users, req.body.user)
            movie.save(function(err, movie) {
                UserModel.findById(req.body.user, function(err, user) {
                    removeItem(user.movies, movieToDelete.id);
                    user.save(function(err) {
                        UserModel.findById(req.body.user)
                        .populate('movies')
                        .exec(function (err, movies) {
                            res.json({
                                profile: movies.serialize(),
                                preferences: movies.findMost()
                            })
                        })
                    })
                })
            })
        })
    }
}

router.delete('/delete', tryCatch(deleteMovie));
// // //

module.exports = router;