const express = require('express')
const router = express.Router()
const { handleSignup, handleLogin } = require('../controllers/staticrouter')
const shows = require('../models/shows')
const users = require('../models/users')
const mongoose = require('mongoose')
const ContactForm = require('../models/ContactForm')


function isAuthenticated(req, res, next) {
    if (req.user) return next();
    res.redirect('/login');
}

router.get('/', isAuthenticated, async (req, res) => {
    const user = req.user || null;

    const usershows = user ? await shows.find({ createdBy: user._id }) : [];
    res.render('animehomepage', {
        user, shows: usershows
    })


})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/signup', (req, res) => {
    res.render('signup')
})
router.get('/search', (req, res) => {
    const user = req.user
    res.render('searchpage',{
        user
    })
})
router.post('/search', async(req, res) => {
 const {username} = req.body
 const hamarauser = await users.findOne({ username: req.user.username })
    if (username == req.user.username) {
        return res.redirect('/myprofile')
    }
    else {

        const user = await users.findOne({ username })
        if (!user) {
            return res.render('errorpage', { error: 'user not found' })
        }
        else {
            const objectId = new mongoose.Types.ObjectId(user.id)
            const usershows = await shows.find({ createdBy: objectId, status: "FINISHED" }).sort({ rating: -1 })
            console.log(usershows)
            return res.render('userprofile', { user: hamarauser, oguser: user, shows: usershows })
        }
    }
})

router.get('/about', (req, res) => {
    const user = req.user || null;

    res.render('about', {
        user
    })
})
router.get('/contact', (req, res) => {
    const user = req.user || null;

    res.render('contact', {
        user
    })
})


router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
  
    try {
      const newContact = new ContactForm({
        name,
        email,
        message
      });
  
      await newContact.save();
      res.status(200).send('Contact form submitted successfully!');
    } catch (error) {
      console.log(error);
      res.status(500).send('Error saving data.');
    }
  });



router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})




router.post('/signup', handleSignup)
router.post('/login', handleLogin)
module.exports = router