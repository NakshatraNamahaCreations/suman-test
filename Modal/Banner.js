const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        bannerTitle: { type: String, required: true, trim: true },
        bannerImage: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
