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
                console.log(user)
                user.movies.push(movie);
                user.save(function(err, user) {
                    res.json({
                        user: user.serialize(),
                        message: 'Movie Saved!'
                    })
                })
            })
        })
    } else {

        const existingSavedMovie = await UserModel.findById(req.body.user);

        const exist = existingSavedMovie.movies;
        console.log('kiwi exist returns', exist)
        console.log('kiwi existing record is returns', existingRecord.id)


        const modifyExisting = (arr, existing) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == existing) {
                    
                    return res.json({
                        message: 'Already Saved!'
                    })
                } 
            }
            
           UserModel.findById(req.body.user, function(err, user) {
                user.movies.push(existingRecord.id);
                user.save()
            }).then(
                MovieModel.findById(existingRecord.id, function(err, movie) {
                    movie.users.push(req.body.user);
                    movie.save(function(err, movie) {
                        res.json({
                            movie: movie.serialize(),
                            message: 'Movie Saved!'
                        })
                    })
                })
            )
        }

        return modifyExisting(exist, existingRecord.id)
    }
}

router.post('/save', tryCatch(saveMovie));
// // //

module.exports = router;