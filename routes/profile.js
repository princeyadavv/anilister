const express = require('express');
const router = express.Router();
const show = require('../models/shows');
const mongoose = require('mongoose');
const users = require('../models/users');
const { updateToken } = require('../services/updateToken')

router.get('/', async (req, res) => {
    const user = await users.findOne({ username: req.user.username })

    const objectid = new mongoose.Types.ObjectId(user._id);
    const animefinish = await show.find({ createdBy: objectid}).sort({ rating: -1 });
    return res.render('myprofile', {
        user, shows: animefinish
    });
});

router.get('/editprofile', async(req, res) => {
    const user = await users.findOne({username:req.user.username})
    return res.render('editprofile', {
        user
    });
});

router.post('/editprofile', async (req, res) => {
    try {
        const { firstName, middleName, lastName, username, bio } = req.body;
        const userId = req.user._id;


        const isUsernameTaken = await users.findOne({ username, _id: { $ne: userId } });
        if (isUsernameTaken) {
            return res.render('editprofile', {
                user: req.user,
                error: 'Username not available'
            });
        }


        const user = await users.findByIdAndUpdate(
            userId,
            {
                firstName,
                middleName,
                lastName,
                username,
                bio
            },
            { new: true }
        );


        updateToken(user, res);


        return res.redirect('/myprofile');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
