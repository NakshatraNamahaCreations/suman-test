const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    getAll,
    getById,
    update,
    remove,
} = require("../Controller/User");

router.post("/signup", signup);
router.post("/login", login);

router.get("/all", getAll);
router.get("/:id", getById);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);

module.exports = router;
