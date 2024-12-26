const express = require('express')
const router = express.Router()
const shows = require('../models/shows')
const mongoose = require('mongoose');

router.use(express.json());

router.get('/', async (req, res) => {
    const user = req.user || null;
    const usershows = user ? await shows.find({ createdBy: user._id }) : [];

    res.render('animehomepage',
        { user, shows: usershows }
    )
})
router.get('/watchlist', async (req, res) => {
    const user = req.user || null;
    const usershows = user ? await shows.find({ createdBy: user._id, type: "ANIME", status: "WATCHLIST" }).sort({ rating: -1 }) : [];
    res.render('animewatchlist', { user, shows: usershows })
})
router.get('/finish', async (req, res) => {
    const user = req.user || null;
    const usershows = user ? await shows.find({ createdBy: user._id, type: "ANIME", status: "FINISHED" }).sort({ rating: -1 }) : [];
    res.render('animefinish', { user, shows: usershows })
})
router.post('/addtofinish', async (req, res) => {
    try {
        const { _id } = req.body;
        const objectId = new mongoose.Types.ObjectId(_id);
        const show = await shows.findOne({ _id: objectId, type: "ANIME" });

        if (show) {

            show.status = "FINISHED";


            await show.save();


            return res.status(200).json({ status: 'success', message: 'Show marked as finished' });
        } else {

            return res.status(404).json({ status: 'error', message: 'Show not found' });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/editshow/:id', async (req, res) => {
    const _id = req.params.id
    const objectId = new mongoose.Types.ObjectId(_id);
    const show = await shows.findOne({ _id: objectId })

    return res.render('editshow', {
        show
    })
})


module.exports = router