const prisma = require('../db/prisma');


const filesGet = (req, res) => {
    res.send('yo');
}

const getAllPost = async(req, res) => {
    if(!req.user) {
        res.redirect('/');
    }
    
     //get active files
     const activeFiles = await prisma.getFilesFromUser(req.user.id);
     const activeUser = await prisma.getUserById(req.user.id);
     console.log(activeFiles)
     res.render('homeAuth', {files: activeFiles, user: activeUser});
}

//upload
const uploadFilePost = async (req, res) => {
    try {
    if(!req.user) {
        res.redirect('/');
        return;
    }
    if(!req.files || !req.files.file) {
        return res.status(422).send('No files were uploaded')
    }
    //check files limit
    const hasRight = await prisma.filesCheckLimit(req.user.id);
    if(!hasRight) {
        console.log('Max 5 files per users');
        res.redirect('/auth');
        return;
    }

    const folderId = parseInt(req.body.folderId);
    const file = req.files.file;
    const temp = req.files.file.tempFilePath;

    await prisma.createFile(req.user.id, file, folderId, temp);

    //get active files
    const activeFiles = await prisma.getFilesByFolder(req.user.id, folderId);
    const folder = await prisma.getFolderById(folderId);
    res.render('folder', {files: activeFiles, user: req.user, folder});



    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
    
}


//delete file
const deleteFile = async (req, res) => {
    try {
        if(!req.user) {
            res.redirect('/');
            return;
        }
        const file_id = parseInt(req.body.file_id);
        const user_id = req.user.id;
        const folder_id = req.body.folder_id

        
        //find the file and delete
        await prisma.deleteFileById(user_id, file_id);
        
        res.redirect(`/folders/${folder_id}`);
        
    } catch (error) {
        console.error(error);
        return;
    }
}


module.exports = {
    filesGet,
    uploadFilePost,
    deleteFile
}