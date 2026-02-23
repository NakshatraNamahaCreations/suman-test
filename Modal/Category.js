const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, required: true, trim: true },
        ecategory: { type: String, trim: true },
        image: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
