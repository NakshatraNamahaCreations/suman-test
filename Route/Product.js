const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getByCategoryName,
    getBySubcategoryName,
} = require("../Controller/Product");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/products"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + "_" + Math.round(Math.random() * 1e9) + ext);
    },
});

const upload = multer({ storage });

router.post("/create", upload.array("images", 10), createProduct);
router.get("/all", getAllProducts);

router.get("/category/:categoryName", getByCategoryName);
router.get("/subcategory/:subcategoryName", getBySubcategoryName);

router.get("/:id", getProductById);
router.put("/update/:id", upload.array("images", 10), updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
