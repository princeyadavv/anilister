const bcrypt = require('bcrypt');
const user = require('../models/users')
const{createToken} = require('../services/authentication')

async function handleSignup(req, res) {
  const { firstName, lastName, middleName, username, password } = req.body
  
  const isuser = await user.findOne({ username })
  if (isuser) {
    return res.render("signup", { error: "user already exists" })
  }
  else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
      } else {
        user.create({ firstName, lastName, middleName, username, password: hash })
      }
    });
  }
  res.redirect('/')
}

async function handleLogin(req, res) {
  const { username, password } = req.body
  const User = await user.findOne({ username })
  if (!User) {
    return res.render("login", { error: "no user found" })
  }
  else {
    bcrypt.compare(password, User.password, (err, isMatch) => {
      if (err) {
        return res.render('login',{error:'incorrect password'})
      } else if (isMatch) {
        console.log(User);
        const token = createToken(User)
        return res.cookie('token',token).redirect('/')

      } else {
        console.log("Invalid password.");
      }
    });
  }

}

module.exports = {
  handleSignup,
  handleLogin
}