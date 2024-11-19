const express = require('express');
const { uploadFile, saveFile, files, file, updateFile, fileShareable } = require('../utils/file');
const { protect, protectFile } = require('../utils/auth');

const router = express.Router();

router.post('/upload', protect, uploadFile, saveFile);
router.get('/', protect, files)
router.get('/:filename', protectFile, file);
router.get('/shareable-link/:filename', protect, fileShareable)
router.put('/update/:id', protect, updateFile);

module.exports = router;
