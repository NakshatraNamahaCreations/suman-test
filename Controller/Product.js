const Product = require("../Modal/Product");
const fs = require("fs");
const path = require("path");

const safeUnlink = (imgPath) => {
    try {
        if (!imgPath) return;
        const filePath = path.join(process.cwd(), imgPath.replace("/", ""));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) { }
};

exports.createProduct = async (req, res) => {
    try {
        const {
            productName,
            categoryName,
            subcategoryName,
            brand,
            mrp,
            sellingPrice,
            description,
            isActive,
        } = req.body;

        const addedQuantity = Number(req.body.addedQuantity);
        const availableQuantityRaw = req.body.availableQuantity;

        if (!productName || !categoryName || !subcategoryName) {
            return res.status(400).json({
                success: false,
                message: "productName, categoryName, subcategoryName required",
            });
        }

        if (Number.isNaN(addedQuantity) || addedQuantity < 0) {
            return res.status(400).json({ success: false, message: "addedQuantity must be >= 0" });
        }

        const availableQuantity =
            availableQuantityRaw === undefined || availableQuantityRaw === ""
                ? addedQuantity
                : Number(availableQuantityRaw);

        if (Number.isNaN(availableQuantity) || availableQuantity < 0) {
            return res.status(400).json({ success: false, message: "availableQuantity must be >= 0" });
        }

        const uploaded = (req.files || []).map((f) => `/uploads/products/${f.filename}`);
        if (uploaded.length > 10) {
            return res.status(400).json({ success: false, message: "Max 10 images allowed" });
        }

        const data = await Product.create({
            productName: productName.trim(),
            categoryName: categoryName.trim(),
            subcategoryName: subcategoryName.trim(),

            addedQuantity,
            availableQuantity,

            brand: brand ? String(brand).trim() : "",
            mrp: mrp ? Number(mrp) : 0,
            sellingPrice: sellingPrice ? Number(sellingPrice) : 0,
            description: description ? String(description).trim() : "",
            isActive: isActive === undefined ? true : String(isActive).toLowerCase() === "true",

            images: uploaded,
        });

        return res.status(201).json({ success: true, message: "Product created", data });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const list = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Product not found" });
        return res.status(200).json({ success: true, data: item });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getByCategoryName = async (req, res) => {
    try {
        const categoryName = decodeURIComponent(req.params.categoryName || "").trim();
        const list = await Product.find({
            categoryName: { $regex: `^${categoryName}$`, $options: "i" },
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getBySubcategoryName = async (req, res) => {
    try {
        const subcategoryName = decodeURIComponent(req.params.subcategoryName || "").trim();
        const list = await Product.find({
            subcategoryName: { $regex: `^${subcategoryName}$`, $options: "i" },
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Product not found" });

        const {
            productName,
            categoryName,
            subcategoryName,
            brand,
            mrp,
            sellingPrice,
            description,
            isActive,
            addedQuantity,
            availableQuantity,
            replaceImages,
        } = req.body;

        if (productName) item.productName = productName.trim();
        if (categoryName) item.categoryName = categoryName.trim();
        if (subcategoryName) item.subcategoryName = subcategoryName.trim();

        if (brand !== undefined) item.brand = String(brand).trim();
        if (mrp !== undefined) item.mrp = Number(mrp) || 0;
        if (sellingPrice !== undefined) item.sellingPrice = Number(sellingPrice) || 0;

        if (description !== undefined) item.description = String(description).trim();
        if (isActive !== undefined) item.isActive = String(isActive).toLowerCase() === "true";

        if (addedQuantity !== undefined) {
            const aq = Number(addedQuantity);
            if (Number.isNaN(aq) || aq < 0)
                return res.status(400).json({ success: false, message: "addedQuantity must be >= 0" });
            item.addedQuantity = aq;
        }

        if (availableQuantity !== undefined) {
            const av = Number(availableQuantity);
            if (Number.isNaN(av) || av < 0)
                return res.status(400).json({ success: false, message: "availableQuantity must be >= 0" });
            item.availableQuantity = av;
        }

        const uploaded = (req.files || []).map((f) => `/uploads/products/${f.filename}`);

        if (uploaded.length > 0) {
            const doReplace = String(replaceImages).toLowerCase() === "true";

            if (doReplace) {
                (item.images || []).forEach(safeUnlink);
                item.images = uploaded.slice(0, 10);
            } else {
                const merged = [...(item.images || []), ...uploaded];
                if (merged.length > 10) {
                    merged.slice(10).forEach(safeUnlink);
                    return res.status(400).json({
                        success: false,
                        message: "Max 10 images allowed (existing + new)",
                    });
                }
                item.images = merged;
            }
        }

        await item.save();
        return res.status(200).json({ success: true, message: "Product updated", data: item });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Product not found" });

        (item.images || []).forEach(safeUnlink);
        await Product.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, message: "Product deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
