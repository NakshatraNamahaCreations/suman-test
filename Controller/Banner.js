const Banner = require("../Modal/Banner");
const fs = require("fs");
const path = require("path");

exports.createBanner = async (req, res) => {
    try {
        const { bannerTitle } = req.body;

        if (!bannerTitle) {
            return res.status(400).json({ success: false, message: "bannerTitle required" });
        }

        const img = req.file ? `/uploads/banners/${req.file.filename}` : "";

        const data = await Banner.create({
            bannerTitle: bannerTitle.trim(),
            bannerImage: img,
        });

        return res.status(201).json({ success: true, message: "Banner created", data });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllBanners = async (req, res) => {
    try {
        const list = await Banner.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getBannerById = async (req, res) => {
    try {
        const item = await Banner.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Banner not found" });
        return res.status(200).json({ success: true, data: item });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const { bannerTitle } = req.body;

        const item = await Banner.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Banner not found" });

        if (bannerTitle) item.bannerTitle = bannerTitle.trim();

        if (req.file) {
            try {
                if (item.bannerImage) {
                    const oldPath = path.join(process.cwd(), item.bannerImage.replace("/", ""));
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            } catch (e) {
            }

            item.bannerImage = `/uploads/banners/${req.file.filename}`;
        }

        await item.save();

        return res.status(200).json({ success: true, message: "Banner updated", data: item });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const item = await Banner.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Banner not found" });

        try {
            if (item.bannerImage) {
                const filePath = path.join(process.cwd(), item.bannerImage.replace("/", ""));
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        } catch (e) {
        }

        await Banner.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: "Banner deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
