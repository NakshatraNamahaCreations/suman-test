const SubCategory = require("../Modal/Subcategory");
const fs = require("fs");
const path = require("path");

exports.createSubCategory = async (req, res) => {
    try {
        const { categoryName, subcategoryName } = req.body;

        if (!categoryName || !subcategoryName) {
            return res.status(400).json({
                success: false,
                message: "categoryName and subcategoryName required",
            });
        }

        const img = req.file ? `/uploads/subcategories/${req.file.filename}` : "";

        const data = await SubCategory.create({
            categoryName: categoryName.trim(),
            subcategoryName: subcategoryName.trim(),
            subcategoryImage: img,
        });

        return res.status(201).json({ success: true, message: "SubCategory created", data });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllSubCategories = async (req, res) => {
    try {
        const list = await SubCategory.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getSubCategoryById = async (req, res) => {
    try {
        const item = await SubCategory.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "SubCategory not found" });
        return res.status(200).json({ success: true, data: item });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getByCategoryName = async (req, res) => {
    try {
        const raw = req.params.categoryName || "";
        const categoryName = decodeURIComponent(raw).trim();

        if (!categoryName) {
            return res.status(400).json({ success: false, message: "categoryName required" });
        }

        const list = await SubCategory.find({
            categoryName: { $regex: `^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        const { categoryName, subcategoryName } = req.body;

        const item = await SubCategory.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "SubCategory not found" });

        if (categoryName) item.categoryName = categoryName.trim();
        if (subcategoryName) item.subcategoryName = subcategoryName.trim();

        if (req.file) {
            try {
                if (item.subcategoryImage) {
                    const oldFilePath = path.join(process.cwd(), item.subcategoryImage.replace("/", ""));
                    if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
                }
            } catch (e) {
            }
            item.subcategoryImage = `/uploads/subcategories/${req.file.filename}`;
        }

        await item.save();

        return res.status(200).json({ success: true, message: "SubCategory updated", data: item });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteSubCategory = async (req, res) => {
    try {
        const item = await SubCategory.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "SubCategory not found" });

        try {
            if (item.subcategoryImage) {
                const filePath = path.join(process.cwd(), item.subcategoryImage.replace("/", ""));
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        } catch (e) {
        }

        await SubCategory.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: "SubCategory deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
