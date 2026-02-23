const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

// controller functions
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../Controller/Category");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/categories");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage });

router.post("/create", upload.single("image"), createCategory);       // CREATE
router.get("/all", getCategories);                                 // GET ALL
router.get("/getbyid/:id", getCategoryById);                            // GET BY ID
router.put("/update/:id", upload.single("image"), updateCategory);     // UPDATE
router.delete("/delete/:id", deleteCategory);                          // DELETE

module.exports = router;
