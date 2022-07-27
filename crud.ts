import department from "./department";
import employees from "./employees";
import express from 'express';

const app = express();
app.use(express.json());

export const getEmployees =async (req:express.Request, res:express.Response) => {
    
    try{
        employees.hasOne(department, {
            foreignKey: 'id'
        });
        
        const emp = await employees.findAll({
            include: department
        });
        res.send(emp);
        
    }catch(err){
        console.log(err);
    }
    
};
