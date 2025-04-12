const prisma = require('../db/prisma');

const postCreateFolder = async (req, res) => {
    try {
        //check for the limit
        const hasRight = await prisma.foldersCheckLimit(req.user.id);
        if(!hasRight) {
            console.log('Max 5 folders by users.')
            res.redirect('/auth');
            return;
        }


        await prisma.createFolder(req.body.name, req.user.id);
        const allFolders = await prisma.getFoldersById(req.user.id);
        res.render('homeAuth', {user: req.user, folders: allFolders})
    } catch (error) {
        console.error(error);
        res.redirect('/')
    }
    
}

//Get folders on id
const getFolderOnId = async (req, res) => {
    if(!req.user) {
        res.redirect('/');
        return;
    }

    //change the params to an int
    const folderId = parseInt(req.params.id);

    //check if exist
    const folder = await prisma.getFolderById(folderId);
    if(!folder) {
        res.send('doest exist !')
        return;
    }
    //get folder
    const files = await prisma.getFilesByFolder(req.user.id, folderId);
    res.render('folder', {user: req.user, folder, files});
}



//Delete folder

const deleteFolder = async(req, res) => {
    try {
        if(!req.user) {
            res.redirect('/');
            return;
        }
        const folderId = parseInt(req.body.folder_id);
        //delete folder
        await prisma.deleteFolderById(folderId, req.user.id);

        res.redirect('/auth')
    } catch (error) {
        console.error(error);
        return;
    }
}


module.exports = {
    postCreateFolder,
    getFolderOnId,
    deleteFolder
}