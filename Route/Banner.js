const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
} = require("../Controller/Banner");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/banners"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/create", upload.single("bannerImage"), createBanner);
router.get("/all", getAllBanners);
router.get("/:id", getBannerById);
router.put("/update/:id", upload.single("bannerImage"), updateBanner);
router.delete("/delete/:id", deleteBanner);

module.exports = router;
