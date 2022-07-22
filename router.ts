import express from "express";
import { SubjectRemovedAndUpdatedError } from "typeorm";

import { getEmployees } from "./crud";

const router = express.Router();

router.get('/employees', getEmployees);

export default router;