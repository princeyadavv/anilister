const express = require('express')
const router = express.Router()
const users = require('../models/users')

router.get('/',async(req,res)=>{
const user = await users.findOne({username:req.user.username}).populate('likes')  
      .populate('liked')  
      .populate('views');
    return res.render('dashboard',{user})
})

module.exports = router