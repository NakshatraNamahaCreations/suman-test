const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");

mongoose
    .connect(process.env.MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() =>
        console.log("=============MongoDb Database connected successfuly")
    )
    .catch((err) => console.log("Database Not connected !!!", err));


app.use("/uploads", express.static("uploads"));


app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const adminRoute = require("./Route/Admin");
const userRoute = require("./Route/User");
const userCategory = require("./Route/Category");
const SubCategory = require("./Route/Subcategory");
const Banner = require("./Route/Banner");
const Product = require("./Route/Product");


app.use("/api", adminRoute);
app.use("/api/user", userRoute);
app.use("/api/category", userCategory);
app.use("/api/SubCategory", SubCategory);
app.use("/api/banner", Banner);
app.use("/api/product", Product);

const PORT = process.env.PORT || 8000;

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Welcome to Suman Back end" });
});

app.listen(PORT, () => {
    console.log("Server is running on", PORT);
});
