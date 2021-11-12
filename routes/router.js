const express = require('express');
const morgan = require('morgan');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const router = express.Router();

router.use(morgan('dev'));

router.get('/', async(req, res) => {
    try {
        res.status(200).render('index', {
            username: null,
            email: null,
            success: null
        });
    } catch(error) {
        res.status(500).send(error);
    }
});

router.post('/', async(req, res) => {
    const line = `======================================================================`;
    try {
        const newUser = new User({
            username: req.body.username,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS
                ).toString(),
            email: req.body.email
            });
            const userCreated = await newUser.save();
            if (userCreated) {
                console.log(line);
                console.log(`"${req.body.username}" signed up successfully`);
                console.log(line);
                return res.status(200).render('index', {
                    username: null,
                    email: null,
                    success: `Sign up successful`
                });
            }
        } catch(error) {
            const userName = await User.findOne({username: req.body.username});
            const userEmail = await User.findOne({email: req.body.email});
            const usernameRes = `This username already taken`;
            const emailRes = `This email already registered`;
            if (userName) {            
                if (userEmail) {
                    console.log(line);
                    console.log(`The username "${req.body.username}" and the email "${req.body.email}" already existed`);
                    console.log(line);
                    return res.status(500).render('index', {
                        username: usernameRes,
                        email: emailRes,
                        success: null
                    });
                } else {
                    console.log(line);
                    console.log(`The username "${req.body.username}" already taken`);
                    console.log(line);
                    return res.status(500).render('index', {
                        username: usernameRes,
                        email: null,
                        success: null
                    });
                }
            } else if (userEmail) {
                console.log(line);
                console.log(`The email "${req.body.email}" already registered`);
                console.log(line);
                return res.status(500).render('index', {
                    username: null,
                    email: emailRes,
                    success: null
                });
            }
            console.log(error);
        }
    });
    
    router.get('/users', async (req, res) => {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).send(error);
        }
    });
    
    router.get('/users/:username', async (req, res) => {
        try {
            const user = await User.findOne({username: req.params.username});
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

module.exports = router;