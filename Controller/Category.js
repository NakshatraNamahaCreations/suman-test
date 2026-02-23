const Category = require("../Modal/Category");
const fs = require("fs");
const path = require("path");

exports.createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const ecategory = req.body.ecategory ?? req.body.eCategory ?? "";

        if (!categoryName) {
            return res.status(400).json({ success: false, message: "categoryName required" });
        }

        const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : "";

        const category = await Category.create({
            categoryName: categoryName.trim(),
            ecategory: ecategory ? String(ecategory).trim() : "",
            image: imagePath,
        });

        return res.status(201).json({
            success: true,
            message: "Category created",
            data: category,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const list = await Category.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const cat = await Category.findById(req.params.id);
        if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
        return res.status(200).json({ success: true, data: cat });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const ecategory = req.body.ecategory ?? req.body.eCategory;

        const cat = await Category.findById(req.params.id);
        if (!cat) return res.status(404).json({ success: false, message: "Category not found" });

        if (categoryName) cat.categoryName = categoryName.trim();
        if (ecategory !== undefined) cat.ecategory = String(ecategory).trim();

        if (req.file) {
            if (cat.image) {
                const oldPath = path.join(process.cwd(), cat.image.replace("/", ""));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            cat.image = `/uploads/categories/${req.file.filename}`;
        }

        await cat.save();

        return res.status(200).json({
            success: true,
            message: "Category updated",
            data: cat,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const cat = await Category.findById(req.params.id);
        if (!cat) return res.status(404).json({ success: false, message: "Category not found" });

        if (cat.image) {
            const filePath = path.join(process.cwd(), cat.image.replace("/", ""));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: "Category deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
