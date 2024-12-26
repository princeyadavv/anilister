const { createToken } = require('../services/authentication');

function updateToken(user, res) {
    const token = createToken(user);
    res.cookie('token', token); 
}

module.exports = { updateToken };
