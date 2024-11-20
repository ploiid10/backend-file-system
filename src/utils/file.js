const multer = require('multer');
const File = require('../models/fileModel');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants');
const os = require('os');
// Function to get the local IP address
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      // Check for non-internal IPv4 address
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // Fallback if no external IP is found
}


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow images and videos
  const fileTypes = /jpeg|jpg|png|gif|mp4|mkv|webm/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept file
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

// Middleware for file upload
exports.uploadFile = upload.single('file');

// Save file metadata to database
exports.saveFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  try {
    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      uploadedBy: req.user.id,
      tags: req.body.tags || [],
    });
    await file.save();
    res.status(201).json({ file });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

exports.files = async (req, res) => {
  try {
    const files = await File.find();
    res.status(201).json(files);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}

exports.file = async (req, res) => {
  const fileName = req.params.filename;
  const token = req.query.token;
  const decoded = jwt.verify(token, SECRET_KEY);
  const filePath = path.join(__dirname, '../uploads', fileName);
  // Check if the file exists
  fs.access(filePath, fs.constants.R_OK, async (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    } else {
      try {
        await File.findByIdAndUpdate(
          decoded.fileId,  // Find the file by its ID
          { $inc: { views: 1 } },  // Increment the views by 1
          { new: true }  // Return the updated document
        );
      } catch (err) {
        console.log(err)
      }
      res.sendFile(filePath);  // Serve the specific file
    }
  });
}


exports.updateFile = async (req, res) => {
  try {
    const { tags } = req.body;  // Extract tags from the body
    const fileId = req.params.id; // Get file ID from URL params

    // Validate the input
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags should be an array.' });
    }

    // Find the file by its ID and update the tags
    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { tags },
      { new: true } // Return the updated file
    );

    // If file is not found
    if (!updatedFile) {
      return res.status(404).json({ error: 'File not found.' });
    }

    res.status(200).json(updatedFile);  // Respond with updated file info
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update file.' });
  }
}

exports.fileShareable = async (req, res) => {
  const { filename } = req.params;

  // Fetch file metadata (e.g., from a database)
  const file = await File.findOne({ filename });

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Create the JWT payload
  const payload = {
    filename: file.filename,
    fileId: file._id,
  };

  // Generate the JWT
  const token = jwt.sign(payload, SECRET_KEY);
  // Get the current IP address
  const currentIp = getLocalIP();
  // Create the shareable link
  const shareableLink = `http://${currentIp}:3000/api/files/${file.filename}?token=${token}`;

  res.json({ shareableLink });
}