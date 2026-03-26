const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const { uploadFile, multiUploadFiles } = require('../controllers/upload.controller');

router.post('/upload', upload.single('file'),  uploadFile)
router.post('/multi-upload', upload.array('files', 5),  multiUploadFiles)

module.exports = router;