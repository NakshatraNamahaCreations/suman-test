const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, required: true, trim: true },
        subcategoryName: { type: String, required: true, trim: true },
        subcategoryImage: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
