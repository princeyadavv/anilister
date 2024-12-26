const express = require('express')
const router = express.Router()
const users = require('../models/users')
const shows = require('../models/shows')
const mongoose = require('mongoose')
router.use(express.json());


router.get('/:username', async (req, res) => {
    const username = req.params.username
    const hamarauser = await users.findOne({ username: req.user.username })
    if (username == req.user.username) {
        return res.redirect('/myprofile')
    }
    else {

        const user = await users.findOneAndUpdate(
            { username},                 // Filter: Find user by name
    { $push: { views: req.user._id } }, // Push 'Gaming' into hobbies array
    { new: true }    
          );
        if (!user) {
            return res.render('errorpage', { error: 'user not found' })
        }
        else {
            const objectId = new mongoose.Types.ObjectId(user.id)
            const anime = await shows.find({ createdBy: objectId ,type:'ANIME'}).sort({ rating: -1 });
    const manga = await shows.find({ createdBy: objectId,type:'MANGA'}).sort({ rating: -1 });
            return res.render('userprofile', { user: hamarauser, oguser: user, anime,manga})
        }
    }

})
router.post('/likedto/:id', async (req, res) => {
    try {
        console.log('request aagayi')
        const id = req.params.id;
        const currentuser = req.user;
        const { liked } = req.body;


        const oguser = await users.findById(id);


        if (!oguser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (liked) {
            // Like the target user
            await users.findByIdAndUpdate(id, {
                $addToSet: { likes: currentuser._id } // Prevent duplicates
            });

            await users.findByIdAndUpdate(currentuser._id, {
                $addToSet: { liked: oguser._id }
            });
        } else {
            // Unlike the target user
            await users.findByIdAndUpdate(id, {
                $pull: { likes: currentuser._id } // Remove from likes
            });

            await users.findByIdAndUpdate(currentuser._id, {
                $pull: { liked: oguser._id }
            });
        }


        const updatedOguser = await users.findById(id);
        res.status(200).json({ newLikeCount: updatedOguser.likes.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router