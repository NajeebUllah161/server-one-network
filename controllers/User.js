import { User } from "../models/users.js";
import { sendToken } from "../utils/sendToken.js";

export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "User Already Exists" });
        }

        user = await User.create({
            name, email, password
        });

        sendToken(res, user, 200, "Registration successful");

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Please enter all fields" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Email or Password" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Email or Password" });
        }

        sendToken(res, user, 200, "Login successful");

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {

    try {
        res
            .status(200)
            .cookie("token", null, {
                expires: new Date(Date.now()),
            })
            .json({ success: true, message: "Logged out successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addUser = async (req, res) => {

    try {
        const {
            full_name,
            email,
            nick_name,
            birth_date,
            gender } = req.body;

        const user = await User.findById(req.user._id);

        user.users.push({
            full_name,
            email,
            nick_name,
            birth_date,
            gender,
            createdAt: new Date(Date.now()),
        });

        await user.save();
        res.status(200).json({ success: true, message: "User added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const removeUser = async (req, res) => {

    try {
        const { userId } = req.params;

        const user = await User.findById(req.user._id);

        user.users = user.users.filter(user => user._id.toString() !== userId.toString());

        await user.save();
        res.status(200).json({ success: true, message: "User Removed Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateUser = async (req, res) => {

    try {
        const { userId } = req.params;
        const {
            full_name,
            email,
            nick_name,
            birth_date,
            gender } = req.body;

        const user = await User.findById(req.user._id);

        user.user = user.users.find((user) => user._id.toString() === userId.toString());

        if (full_name) user.user.full_name = full_name.toString();
        if (email) user.user.email = email.toString();
        if (nick_name) user.user.nick_name = nick_name.toString();
        if (birth_date) user.user.birth_date = birth_date.toString();
        if (gender) user.user.gender = gender.toString();

        await user.save();
        res.status(200).json({ success: true, message: "User Details updated Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        console.log

        sendToken(res, user, 201, `Welcome back ${user.name}`);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};