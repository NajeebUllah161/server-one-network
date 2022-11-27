import { User } from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";

export const register = async (req, res) => {

    try {
        const { name, email } = req.body;

        // const { avatar } = req.files;

        let user = await User.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "User Already Exists" });
        }

        const password = Math.floor(Math.random() * 1000000);

        user = await User.create({
            name, email, password, avatar: {
                public_id: "",
                url: ""
            }
        });

        await sendMail(email, "Welcome to RopStam, You have been registered successfully!", `You password is ${password}`);

        sendToken(res, user, 200, "Registration successful, you password has been send to your email");

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

export const addVehicle = async (req, res) => {

    try {
        const {
            vehicle_type,
            name,
            color,
            model,
            make,
            reg_number,
            chassis_number, } = req.body;

        const user = await User.findById(req.user._id);

        user.vehicles.push({
            vehicle_type,
            name,
            color,
            model,
            make,
            reg_number,
            chassis_number,
            createdAt: new Date(Date.now()),
        });

        await user.save();
        res.status(200).json({ success: true, message: "Vehicle added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const removeVehicle = async (req, res) => {

    try {
        const { vehicleId } = req.params;

        const user = await User.findById(req.user._id);

        user.vehicles = user.vehicles.filter(vehicle => vehicle._id.toString() !== vehicleId.toString());

        await user.save();
        res.status(200).json({ success: true, message: "Vehicle Removed Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateVehicle = async (req, res) => {

    try {
        const { vehicleId } = req.params;
        const {
            vehicle_type,
            name,
            color,
            model,
            make,
            reg_number,
            chassis_number } = req.body;

        const user = await User.findById(req.user._id);

        user.vehicle = user.vehicles.find((vehicle) => vehicle._id.toString() === vehicleId.toString());

        if (vehicle_type) user.vehicle.vehicle_type = vehicle_type.toString();
        if (name) user.vehicle.name = name.toString();
        if (color) user.vehicle.color = color.toString();
        if (model) user.vehicle.model = model.toString();
        if (make) user.vehicle.make = make.toString();
        if (reg_number) user.vehicle.reg_number = reg_number.toString();
        if (chassis_number) user.vehicle.chassis_number = chassis_number.toString();

        await user.save();
        res.status(200).json({ success: true, message: "Vehicle Details updated Successfully!" });
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