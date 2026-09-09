import express from "express";

import {
    signUp,
    signIn
} from "../controllers/userController.js";

const router = express.Router();

// =========================
// AUTH
// =========================

router.post("/signup", signUp);

router.post("/signin", signIn);

export default router;