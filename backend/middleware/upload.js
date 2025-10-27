const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG/PNG images are allowed!'));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('coverImage');

// Middleware to validate image dimensions
const validateImageDimensions = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const sharp = require('sharp');

  sharp(req.file.path)
    .metadata()
    .then(metadata => {
      const { width, height } = metadata;

      // Very relaxed dimension requirements - allow wide range of book cover sizes
      const validDimensions = (
        (width >= 150 && height >= 200 && width <= 2000 && height <= 3000) ||
        (width >= 200 && height >= 150 && width <= 3000 && height <= 2000)
      );

      if (!validDimensions) {
        // Delete the uploaded file if dimensions are invalid
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Image dimensions must be between 150x200 and 3000x2000 pixels'
        });
      }

      next();
    })
    .catch(err => {
      // Delete the uploaded file if there's an error
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      res.status(400).json({
        success: false,
        message: 'Invalid image file'
      });
    });
};

module.exports = { upload, validateImageDimensions };
