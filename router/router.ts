import express from "express";
import { verifyToken } from "../auth/auth";
import { createEmployee, deleteEmployee, getEmployees, getEmployeesById, subEmployees, updateEmployee} from "../crud/employeescrud";
import { createDepartment, deleteDepartment, getDepartment, getDepartmentById, updateDepartment } from "../crud/departmentcrud";
import { signin, signup } from "../crud/signin";

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
router.get('/employees/:id/subEmployees',verifyToken,subEmployees);
router.post('/signup', signup);
router.post('/signin', signin);

export default router;