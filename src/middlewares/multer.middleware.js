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
  console.log(file, file.mimetype, '--->abhishek');
  
  if (
    file.mimetype === "image/jpeg" ||  // for jpeg files
    file.mimetype === "image/jpg" ||   // for jpg files
    file.mimetype === "image/png" ||   // for png files
    file.mimetype === "image/gif" ||   // for gif files
    file.mimetype === "application/pdf" || // for pdf files
    file.mimetype === "application/vnd.ms-excel" ||  // for .xls (Excel 97-2003)
    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||  // for .xlsx (Excel)
    file.mimetype === "text/csv"  // for .csv files
  ) {
    cb(null, true);  // Accept file
  } else {
    cb(new Error("Only images (jpeg, jpg, png, gif), PDFs, Excel, and CSV files are allowed!"), false);
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
