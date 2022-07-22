import department from "./department";
import Employees from "./employees";
import express from 'express';

const app = express();

export const getEmployees =async (req:express.Request, res:express.Response) => {
    try{
        const employees = await Employees.findAll();
        res.send(employees);
    }catch(err){
        console.log(err);
    }
    
}