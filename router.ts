import express from "express";


import { getEmployees } from "./crud";
import { signin, signup } from "./signin";

const router = express.Router();

router.get('/employees', getEmployees);
router.post('/signup', signup);
router.post('/signin', signin);

export default router;