const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
const PORT = 3000;

// Upload folder
const uploadDir = path.join(__dirname, "uploads");
const previewDir = path.join(__dirname, "previews");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

// Multer
const upload = multer({
  dest: uploadDir,
});

// EPS -> PNG
app.post("/convert", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const inputPath = req.file.path;

    const originalName = path.parse(req.file.originalname).name;

    const outputPath = path.join(
      previewDir,
      `${originalName}-${Date.now()}.png`
    );

    /*
      Ghostscript Windows path

      IMPORTANT:
      যদি তোমার Ghostscript অন্য জায়গায় install হয়,
      তাহলে নিচের path change করতে হবে।
    */

    const gsPath =
      "C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe";

    const args = [
      "-dSAFER",
      "-dBATCH",
      "-dNOPAUSE",
      "-sDEVICE=pngalpha",
      "-r150",
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    execFile(gsPath, args, (error, stdout, stderr) => {
      // Temporary EPS file delete
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (error) {
        console.error("Ghostscript error:", stderr);

        return res.status(500).json({
          error: "EPS conversion failed",
          details: stderr,
        });
      }

      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({
          error: "Preview PNG was not created",
        });
      }

      res.sendFile(outputPath);
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("StockHub Preview Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});