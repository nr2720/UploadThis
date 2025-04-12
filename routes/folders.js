const express = require('express');
const router = express.Router();

const folderController = require('../controllers/folderControllers');

router.get('/', (req, res) => {
    res.send('jes')
})

//Get on folder/id
router.get('/:id', folderController.getFolderOnId)

router.post('/', folderController.postCreateFolder)


//Delete folders
router.delete('/', folderController.deleteFolder)


module.exports = router;

