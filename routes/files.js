var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');

const multer = require('multer');
const upload = multer({ dest: 'upload/'});


const filesController = require('../controllers/filesController');

router.use(fileUpload({
    //Maximum size
    limits: {fileSize: 10* 1024*1024},

    //Temp store file
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))



//get route
router.get('/get', filesController.filesGet);

//post on upload route
router.post('/upload', filesController.uploadFilePost)

//delete file
router.delete('/', filesController.deleteFile)



module.exports = router;
