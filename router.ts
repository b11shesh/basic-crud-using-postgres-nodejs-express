import express from "express";
import { verifyToken } from "./auth";
import { createEmployee, deleteEmployee, getEmployees, getEmployeesById, updateEmployee} from "./crud";
import { createDepartment, deleteDepartment, getDepartment, getDepartmentById, updateDepartment } from "./departmentcrud";
import { signin, signup } from "./signin";

const router = express.Router();

router.post('/employees',verifyToken, createEmployee);
router.get('/employees',verifyToken, getEmployees);
router.get('/employees/:id',verifyToken, getEmployeesById);
router.delete('/employees/:id',verifyToken, deleteEmployee);
router.put('/employees/:id',verifyToken, updateEmployee);
router.get('/departments',verifyToken, getDepartment);
router.get('/departments/:id',verifyToken, getDepartmentById);
router.post('/departments',verifyToken, createDepartment);
router.put('/departments/:id',verifyToken, updateDepartment);
router.delete('/departments/:id',verifyToken, deleteDepartment);
router.post('/signup', signup);
router.post('/signin', signin);

export default router;