const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
    getByCategoryName,
} = require("../Controller/Subcategory");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/subcategories"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/create", upload.single("subcategoryImage"), createSubCategory);
router.get("/all", getAllSubCategories);
router.get("/category/:categoryName", getByCategoryName);
router.get("/:id", getSubCategoryById);
router.put("/update/:id", upload.single("subcategoryImage"), updateSubCategory);
router.delete("/delete/:id", deleteSubCategory);

module.exports = router;
