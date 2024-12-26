const express = require('express')
require('dotenv').config();

const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require("path")


const staticRouter = require('./routes/staticroutes')
const showroute = require('./routes/shows')
const animeroute = require('./routes/anime')
const mangaroute = require('./routes/manga')
const profileroute = require('./routes/profile')
const userprofilerouter = require('./routes/users')
const dashboardrouter = require("./routes/dashboard")
const {checkAuthentication,restrictTo}=require('./middlewares/auth')


const app = express()

mongoose.connect(`mongodb+srv://photographypy04:ZXsRTXHXLHhB3qNs@cluster0.uijuh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
`).then(()=> console.log('mongo connected')).catch(err=> console.log(err))


app.use(express.static('public'))
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkAuthentication())


app.use('/',staticRouter)
app.use('/manga',restrictTo,mangaroute)
app.use('/anime',restrictTo,animeroute)
app.use('/shows',restrictTo,showroute)
app.use('/myprofile',restrictTo,profileroute)
app.use('/users',restrictTo,userprofilerouter)
app.use('/dashboard',restrictTo,dashboardrouter)





app.listen(5000,()=>console.log(`http://localhost:5000`))