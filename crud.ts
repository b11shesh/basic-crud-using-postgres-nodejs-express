import Department from "./department";
import Employees from "./employees";
import express from 'express';
import sequelize from "./database";
import { stringify } from "querystring";


const app = express();
app.use(express.json());

export const getEmployees =async (req:express.Request, res:express.Response) => {
    
    try{
        Department.hasMany(Employees);
        const employees = await Employees.findAll();
        res.send(employees);
        
    }catch(err){
        console.log(err);
    }
    
};
