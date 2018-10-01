const UserModel = require('./users/user.model');
const usersRouter = require('./users/user.router');

const apiConfig = {
    users: {
        router: usersRouter,
        models: {
            users: UserModel
        }
    }
}

function setupRoutes(app) {
    const prefixes = Object.keys(apiConfig);
    prefixes.forEach(prefix => {
        console.log(`SETUP /${prefix} ROUTE PREFIX`);
        const router = apiConfig[prefix].router;
        app.use(`/${prefix}`, router);

    });
}

function getConfig(prefix) {
    return apiConfig[prefix];
}

module.exports = {
    getConfig,
    setupRoutes
}