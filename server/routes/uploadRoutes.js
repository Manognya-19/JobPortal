// server/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");
const { protect } = require("../middleware/authMiddleware");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// store file in memory, then upload to cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/resume",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "resumes",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Upload failed" });
          }
          return res.json({ url: result.secure_url });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
