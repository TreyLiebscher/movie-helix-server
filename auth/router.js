// 'use strict';
// const express = require('express');
// const passport = require('passport');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const { UserModel } = require('../server/API/users/user.model');
// const config = require('../config');
// const tryCatch = require('../server/helpers').expressTryCatchWrapper;
// const router = express.Router();

// const createAuthToken = function(user) {
//     return jwt.sign({user}, config.JWT_SECRET, {
//         subject: user.username,
//         expiresIn: config.JWT_EXPIRY,
//         algorithm: 'HS256'
//     });
// };

// const localAuth = passport.authenticate('local', {session: false, failWithError: false});

// router.use(bodyParser.json());

// const jwtAuth = passport.authenticate('jwt', {session: false});


// async function changePassword(req, res) {
//     const requiredFields = ['newPassword', 'retypeNewPassword'];
//     for (let i = 0; i < requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if (!(field in req.body)) {
//             const message = `Missing \`${field}\` in request body`;
//             console.error(message);
//             return res.status(404).send(message);
//         }
//     }

//     const userPassword = await UserModel.hashPassword(req.body.password);

//     const userRecord = await UserModel.findByIdAndUpdate(req.user.id, {password:userPassword});

//     res.json({
//         user: userRecord.serialize()
//     })
// }

// router.post('/changepassword', jwtAuth, tryCatch(changePassword));

// router.post('/auth/refresh', jwtAuth, (req, res) => {
//     const authToken = createAuthToken(req.user);
//     res.json({authToken});
// });

// module.exports = router;
