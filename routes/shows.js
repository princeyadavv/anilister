const express = require('express');
const router = express.Router();
const show = require('../models/shows');
const { default: mongoose } = require('mongoose');


router.post('/addshow', async (req, res) => {
    const { name, type, status } = req.body;
    let { rating } = req.body


    const isshow = await show.findOne({ name, type });

    if (isshow) {
        return res.send("Show already exists");
    } else {
        const user = req.user;
        if (rating > 5) {
            rating = 5
        }
        if (rating < 1) {
            rating = 1
        }


        const stars = "⭐".repeat(rating);


        const colorcodes = [
  "bg-orange-700",
  "bg-green-500",
  "bg-purple-700",
  "bg-teal-400",
  "bg-red-600"
];
        const color = colorcodes[rating - 1];


        const newShow = await show.create({ name, type, status, rating, createdBy: user._id, stars, color });


        res.redirect('/');
    }
});


router.post('/updateshow', async (req, res) => {
    const { id, name, type, status } = req.body;
    let { rating } = req.body
    if (rating > 5) {
        rating = 5
    }
    if (rating < 1) {
        rating = 1
    }

    const newstars = "⭐".repeat(rating);


    const colorcodes = [
  "bg-orange-700",
  "bg-green-500",
  "bg-purple-700",
  "bg-teal-400",
  "bg-red-600"
];
    const newcolor = colorcodes[rating - 1];


    const objectId = new mongoose.Types.ObjectId(id);


    const showToUpdate = await show.findOne({ _id: objectId });


    if (!showToUpdate) {
        return res.status(404).send("Show not found");
    }


    showToUpdate.name = name;
    showToUpdate.type = type;
    showToUpdate.status = status;
    showToUpdate.rating = rating;
    showToUpdate.stars = newstars;
    showToUpdate.color = newcolor;


    await showToUpdate.save();


    res.redirect('/');
});

router.delete('/updateshow/:showid', async (req, res) => {
    const showid = req.params.showid
    const objectId = new mongoose.Types.ObjectId(showid);
    try {

        const showtodelete = await show.findOneAndDelete({ _id: objectId })
        if (!showtodelete) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.status(200).json({ message: 'Show deleted successfully', data: showtodelete });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting show', error: error.message });
    }

})

module.exports = router;
