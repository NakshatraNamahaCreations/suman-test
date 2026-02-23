const bcrypt = require("bcryptjs");
const User = require("../Modal/User");

// ✅ SIGNUP (bcrypt hash store)
exports.signup = async (req, res) => {
    try {
        const { name, email, mobileNumber, password, confirmPassword } = req.body;

        if (!name || !email || !mobileNumber || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "name, email, mobileNumber, password, confirmPassword required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword not matching",
            });
        }

        const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (emailExists) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const mobileExists = await User.findOne({ mobileNumber: mobileNumber.trim() });
        if (mobileExists) {
            return res.status(409).json({ success: false, message: "Mobile number already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            mobileNumber: mobileNumber.trim(),
            password: hashedPassword, // ✅ hashed store
        });

        // password return panna venam
        const userSafe = await User.findById(user._id);

        return res.status(201).json({
            success: true,
            message: "Signup success",
            data: userSafe,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ LOGIN (bcrypt compare)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password required",
            });
        }

        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase().trim() },
                { mobileNumber: email.trim() },
            ],
        }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Email" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        // password remove pannitu response
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login success",
            data: user,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ GET ALL USERS
exports.getAll = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: users });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ GET USER BY ID
exports.getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ UPDATE USER (if password given -> bcrypt hash again)
exports.update = async (req, res) => {
    try {
        const { name, email, mobileNumber, password, confirmPassword } = req.body;

        const user = await User.findById(req.params.id).select("+password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (name) user.name = name.trim();

        if (email) {
            const newEmail = email.toLowerCase().trim();
            const exists = await User.findOne({ email: newEmail, _id: { $ne: user._id } });
            if (exists) return res.status(409).json({ success: false, message: "Email already exists" });
            user.email = newEmail;
        }

        if (mobileNumber) {
            const newMobile = mobileNumber.trim();
            const exists = await User.findOne({ mobileNumber: newMobile, _id: { $ne: user._id } });
            if (exists) return res.status(409).json({ success: false, message: "Mobile already exists" });
            user.mobileNumber = newMobile;
        }

        // password update
        if (password !== undefined) {
            if (!confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: "confirmPassword required for password update",
                });
            }
            if (password !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Password and confirmPassword not matching",
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        // safe response
        const safe = await User.findById(user._id);
        return res.status(200).json({ success: true, message: "User updated", data: safe });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ DELETE USER
exports.remove = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, message: "User deleted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
