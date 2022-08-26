import employees from "../models/employees";
import {Model, Sequelize, QueryTypes} from 'sequelize';
import { addInErrorFile, addInLogFile, GenericType,  getPagination, getPagingData } from "../commonHelper";
import express from 'express';
import sequelize from "../dbConnection/database";
import { IDecoded } from "../commonHelper";
import * as jwt from "jsonwebtoken";




const app = express();
app.use(express.json());

interface IData{
  id: number,
  name: string,
  supervisorid?: number,
  supervisor: IData[]
} 


export const getEmployees = async (req:express.Request, res:express.Response) => {
    

    const page:number = parseInt(req.query.pageNo as string) ;
    const size:number = parseInt(req.query.pageSize as string) ;
    const searchedName = req.query.search  ;
    const {limit, offset} = getPagination(page ,size);

    // const user = await employees.findAll();
  sequelize.query("SELECT * FROM get_employee()", {type: QueryTypes.SELECT})

    // employees.findAndCountAll({
    //     where:{
    //         name: searchedName ? sequelize.where(sequelize.fn('Lower', sequelize.col('name')), "LIKE", "%" + searchedName + "%"): user.map((item)=> item.getDataValue('name'))
    //     },
    //     limit,
    //     offset        
    // })
    .then(data=>{
        
        // const response = getPagingData(data,page,limit);
         const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 
        
       if (data === []){            

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Error in GET Employee API\" \n`

            addInErrorFile(message);
        return res.status(500).send({message: 'Some error occurred while retrieving Employees'})
       }else{

        const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Get Employee API\" \n`
        addInLogFile(message);
        return res.send(data);
       }
       
    })
    .catch(err => {
          const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

            addInErrorFile(message);
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Employees."
        });
      });
   
};


export const getEmployeesById = async(req: express.Request, res: express.Response)=>{
    const empid = parseInt(req.params.id);
    // employees.hasOne(department, {
    //     foreignKey: 'id'
    // })
    // employees.findByPk(id,{
    //     include: department
    // })
    const emp = sequelize.query("SELECT * FROM get_employee("+empid+")", {type: QueryTypes.SELECT})
    
    .then(data =>{
      const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 
        if (data===[]){
          const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Error in GET Employee By ID API\" \n`
              
          addInErrorFile(message);
        

          return res.status(404).send({
            message: "Error finding Employee with id="+ empid
        });
              
         
        }else{
            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Get Employee By ID API\" \n`

              addInLogFile(message);
              console.log(data);

              return res.send(data);
            
        }
    })
    .catch(err => {
              const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

              const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

              addInErrorFile(message);

        return res.status(500).send({
          message: "Error retrieving Employee with id=" + empid
        });
    });
    
};

export const createEmployee =  async (req: express.Request, res:express.Response)=>{
          employees.create({
            id: req.body.id,
            name: req.body.name,
            address: req.body.address,
            contact: req.body.contact,
            dob: req.body.dob,
            departmentid: req.body.departmentid,
            filepath: req.file?.path            
        })
        .then(employees =>{
            const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Create Employee API\" \n`

            addInLogFile(message);
            return res.send({ message: "Employee was created successfully!" });
        }).catch(err=>{
            const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

              const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

              addInErrorFile(message);
            return res.status(500).send({message: err.message});
        });
};

export const deleteEmployee = async ( req: express.Request, res: express.Response)=>{
    const id= parseInt(req.params.id);
    employees.destroy({
        where: {id:id}
    }).then(num=>{
      const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string);
        if (num == 1){
            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Delete Employee API\" \n`

            addInLogFile(message);
            return res.send({message: "Employee was deleted successfylly!"});
        }
        else{
            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Error in Delete Employee API" \n`

              addInErrorFile(message);
            return res.send({
                message: `Cannot delete employee with id= ${id}.`
            });
        }
    }).catch(err =>{
              const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

              const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

              addInErrorFile(message);
        return res.status(500).send({message: "Could not delete the employee with id="+id});
    });  
};

export const updateEmployee =async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    
    employees.update(req.body, {
        where: { id: id }
      })
        .then(num => {
          const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string);
          if (num.includes(1)) {
             

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Update Employee API\" \n`

            addInLogFile(message);

            return res.send({
              message: "Employee was updated successfully."
            });
          } else {
            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Error in Update Employee API" \n`

              addInErrorFile(message);
            return res.send({
              message: `Cannot update Employee with id=${id}. Maybe Employee was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
              const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

              const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

              addInErrorFile(message);
          return res.status(500).send({
            message: "Error updating Employee with id=" + id
          });
        });
    };
    
  export const subEmployees =async (req :express.Request , res: express.Response) => {
    const id = parseInt(req.params.id);

    sequelize.query(`WITH recursive emp as (
      SELECT id, name, supervisorid
      FROM employees where id = ${id}
      union
      SELECT e.id, e.name, e.supervisorid
      FROM employees e inner join emp on e.id = emp.supervisorid
  ) select * from emp  `, {type: QueryTypes.SELECT}).then((data: any[])=>{
    

    let parent: IData[] =[]
      for(let i = data.length-1; i>=0; i--){
          parent = data.filter((item : IData) => item.id ==data[i].id)
          parent.forEach((p:IData) => p.supervisor= data.filter((item: IData)=> item.id == p.supervisorid))
      }
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

        const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Get SubEmployees API\" \n`

        addInLogFile(message);
    return res.status(200).send(parent);
  }).catch(err => {
          const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

          const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

          addInErrorFile(message);
      return res.status(500).send({
        message: "Error Getting Employee with id=" + id
      });
    });

};