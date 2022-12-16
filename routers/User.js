import express from "express";
import { addUser, getMyProfile, login, logout, register, removeUser, updateUser } from "../controllers/User.js";
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
    .route("/addUser")
    .post(isAuthenticated, addUser);

router
    .route("/profile")
    .get(isAuthenticated, getMyProfile);

router
    .route("/user/:userId")
    .put(isAuthenticated, updateUser)
    .delete(isAuthenticated, removeUser);

export default router;