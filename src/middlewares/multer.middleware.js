import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Storage TESTING");
    cb(null, "uploads/"); // Specify the uploads folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File filter function to allow images and PDFs
const fileFilter = (req, file, cb) => {
  console.log(file,file.mimetype,'--->abhishek')
  if (
    file.mimetype === "image/jpeg" || // for jpeg files
    file.mimetype === "image/jpg" ||   // for jpg files
    file.mimetype === "image/png" ||   // for png files
    file.mimetype === "image/gif" ||   // for gif files
    file.mimetype === "application/pdf" // for pdf files
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, gif) and PDFs are allowed!"), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

export {upload}
