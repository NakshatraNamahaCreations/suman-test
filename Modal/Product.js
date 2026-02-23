const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true, trim: true },
        categoryName: { type: String, required: true, trim: true },
        subcategoryName: { type: String, required: true, trim: true },

        addedQuantity: { type: Number, required: true, min: 0 },
        availableQuantity: { type: Number, required: true, min: 0 },

        brand: { type: String, default: "", trim: true },
        mrp: { type: Number, default: 0, min: 0 },
        sellingPrice: { type: Number, default: 0, min: 0 },
        description: { type: String, default: "", trim: true },
        isActive: { type: Boolean, default: true },

        images: { type: [String], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
