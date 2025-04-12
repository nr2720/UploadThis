const prisma = require('../db/prisma');
const bcryptjs = require('bcryptjs');
const passport = require('passport');




const signUpPost = async (req, res) => {
    try {
        const {username, name, lastname, password, email, country} = req.body;
        const user = await prisma.createUser(username, name, lastname, password, email, country);
        res.redirect('/');
        return;
    } catch (err) {
        console.error(err);
        res.send(err)
    }
}



module.exports = {
    signUpPost
}