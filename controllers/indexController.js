const prisma = require('../db/prisma');

//index on get
const indexGet = (req, res) => {
    res.render('home', {error: req.flash('error')});
};

//index auth
const indexGetAuth = async (req, res) => {
    if(!req.user){
        res.redirect('/');
    }
    else{
        const activeFolders = await prisma.getFoldersById(req.user.id);
        const activeUser = await prisma.getUserById(req.user.id);
        res.render('homeAuth', {user: activeUser, folders: activeFolders});
    }
}


module.exports = {
    indexGet,
    indexGetAuth,
}