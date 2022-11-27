import express from "express";
import { addVehicle, getMyProfile, login, logout, register, removeVehicle, updateVehicle } from "../controllers/User.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router
    .route("/register")
    .post(register);

router
    .route("/login")
    .post(login);

router
    .route("/logout")
    .get(logout);

router
    .route("/addVehicle")
    .post(isAuthenticated, addVehicle);

router
    .route("/profile")
    .get(isAuthenticated, getMyProfile);

router
    .route("/vehicle/:vehicleId")
    .put(isAuthenticated, updateVehicle)
    .delete(isAuthenticated, removeVehicle);

export default router;