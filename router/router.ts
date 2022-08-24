import express from "express";
import { verifyToken , isAdmin} from "../auth/auth";
import { createEmployee, deleteEmployee, getEmployees, getEmployeesById, subEmployees, updateEmployee} from "../crud/employeescrud";
import { createDepartment, deleteDepartment, getDepartment, getDepartmentById, updateDepartment } from "../crud/departmentcrud";
import { signin, signout, signup } from "../crud/signin";
import { getUserInfo } from "../crud/usercrud";
const router = express.Router();

router.get('/users',verifyToken, isAdmin, getUserInfo);
router.post('/employees',verifyToken, isAdmin, createEmployee);
router.get('/employees', verifyToken,  getEmployees);
router.get('/employees/:id',verifyToken, getEmployeesById);
router.delete('/employees/:id',verifyToken, isAdmin, deleteEmployee);
router.put('/employees/:id',verifyToken, isAdmin, updateEmployee);
router.get('/departments',verifyToken, getDepartment);
router.get('/departments/:id',verifyToken, getDepartmentById);
router.post('/departments',verifyToken, isAdmin, createDepartment);
router.put('/departments/:id',verifyToken, isAdmin, updateDepartment);
router.delete('/departments/:id',verifyToken, isAdmin, deleteDepartment);
router.get('/employees/:id/subEmployees',verifyToken, subEmployees);
router.post('/signup', signup);
router.post('/signin', signin);
router.put('/signout/:id',verifyToken, signout);

export default router;