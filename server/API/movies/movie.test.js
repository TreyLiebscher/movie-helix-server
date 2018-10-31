'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');


const {
    app,
    runServer,
    closeServer
} = require('../../server');

const {
    getConfig
} = require('../API');

// const MovieModel = getConfig('movies').models.movies;
// const UserModel = getConfig('users').models.users;
const { MovieModel } = require('./movie.model');



const { testUtilCreateUser, UserModel } = require('../users/user.model');

const deleteCollections = require('../../helpers').deleteCollections;

const {
    TEST_DATABASE_URL,
    PORT
} = require('../../../config');

async function testUserLoginToken() {
    const loginRes = await chai
        .request(app)
        .post('/users/login')
        .send({
            email,
            password
        })
    const authToken = loginRes.body.authToken
    return authToken
}

const expect = chai.expect;
chai.use(chaiHttp);

const seedData = [];



const SEED_DATA_LENGTH = seedData.length;

const email = 'test@test.com';
const username = 'Tester';
const password = 'password123';
let testUser

describe('Movies API routes', function () {
    before(async () => {
        await runServer(TEST_DATABASE_URL, PORT);
        testUser = await testUtilCreateUser();
        seedData.forEach(i => i.user_id = testUser._id);
        console.log(seedData);
    });

    after(async () => {
        await closeServer();
    });

    describe('movies/save', () => {
        it('Should allow a user to save a movie', async () => {
            
            const newMovie = {
                title: 'Test Movie',
                movieId: 123,
                hasPoster: true,
                poster: 'test poster path',
                year: '1900',
                genre : [{id: 1, name: 'test genre'}],
                rating: 10,
                runtime: 120,
                budget: 100,
                revenue: 200,
                production_companies: [{id: 2, name: 'test company'}],
                production_countries: [{id: 3, name: 'test country'}],
                users: [testUser._id],
                user: testUser._id  
            }

            const authToken = await testUserLoginToken();

            const res = await chai
                .request(app)
                .post(`/movies/save`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(newMovie)
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.profile.movies).to.have.length.above(0)
        })

        it('Should not create a new movieModel for a movie already saved', async () => {

            const authToken = await testUserLoginToken();

            const otherUser = await UserModel.create({
                username: 'Another user',
                email: 'another@email.com',
                password: '1234567890'
            })


            const record = await MovieModel.create({
                title: 'Saved Movie',
                movieId: 456,
                hasPoster: true,
                poster: 'test poster path',
                year: '1900',
                genre : [{id: 1, name: 'test genre'}],
                rating: 10,
                runtime: 120,
                budget: 100,
                revenue: 200,
                production_companies: [{id: 2, name: 'test company'}],
                production_countries: [{id: 3, name: 'test country'}],
                users: [otherUser._id]  
            })

            const previouslySavedMovie = {
                title: 'Saved Movie',
                movieId: 456,
                hasPoster: true,
                poster: 'test poster path',
                year: '1900',
                genre : [{id: 1, name: 'test genre'}],
                rating: 10,
                runtime: 120,
                budget: 100,
                revenue: 200,
                production_companies: [{id: 2, name: 'test company'}],
                production_countries: [{id: 3, name: 'test country'}],
                users: [testUser._id],
                user: testUser._id  
            }

            

            const res = await chai
                .request(app)
                .post('/movies/save')
                .set('Authorization', `Bearer ${authToken}`)
                .send(previouslySavedMovie)
            
            expect(res).to.have.status(200)
            expect(res.body.message).to.equal('Movie Modified')
            
        })
    })

    describe('/movies/delete', () => {
        it('Should allow a user to remove association with a movie', async () => {
            const authToken = await testUserLoginToken();

            const res = await chai
                .request(app)
                .delete('/movies/delete')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    user: testUser._id,
                    title: 'Saved Movie'
                })
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.profile.movies).to.have.lengthOf(1)
        })

        it('Should return message when a movie does not exist', async () => {
            const authToken = await testUserLoginToken();

            const res = await chai
                .request(app)
                .delete('/movies/delete')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    user: testUser._id,
                    title: 'Fake Movie'
                })
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.message).to.be.equal(`Movie Fake Movie does not exist`)
        })
    })
})
