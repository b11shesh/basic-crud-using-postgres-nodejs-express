import department from "../models/department";
import employees from "../models/employees";
import sequelize,{Model} from 'sequelize'
import { GenericType, getPagination, getPagingData } from "../commonHelper";
import express from 'express';

const app = express();
app.use(express.json());





export const getEmployees = async (req:express.Request, res:express.Response) => {
    

    const page:number = parseInt(req.query.pageNo as string) ;
    const size:number = parseInt(req.query.pageSize as string) ;
    const searchedName = req.query.search  ;
    const {limit, offset} = getPagination(page ,size);

    const user = await employees.findAll();
    employees.findAndCountAll({
        where:{
            name: searchedName ? sequelize.where(sequelize.fn('Lower', sequelize.col('name')), "LIKE", "%" + searchedName + "%"): user.map((item)=> item.getDataValue('name'))
        },
        limit,
        offset        
    })
    .then(data =>{
        console.log(data)
        const response = getPagingData(data,page,limit);
       
        res.send(response);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Employees."
        });
      });
   
};


export const getEmployeesById = async(req: express.Request, res: express.Response)=>{
    const id = parseInt(req.params.id);
    employees.hasOne(department, {
        foreignKey: 'id'
    })
    employees.findByPk(id,{
        include: department
    })
    
    .then(data =>{
        
        if (data){
            res.send(data);
        }else{
            res.status(404).send({
                message: "Error finding Employee with id="+ id
            });
        }
    })
    .catch(err => {
        res.status(500).send({
          message: "Error retrieving Employee with id=" + id
        });
    });
    
};

export const createEmployee = async (req: express.Request, res:express.Response)=>{
        employees.create({
            id: req.body.id,
            name: req.body.name,
            address: req.body.address,
            contact: req.body.contact,
            dob: req.body.dob,
            departmentid: req.body.departmentid
        })
        .then(employees =>{
            return res.send({ message: "Employee was created successfully!" });
        }).catch(err=>{
            return res.status(500).send({message: err.message});
        });
};

export const deleteEmployee = async ( req: express.Request, res: express.Response)=>{
    const id= parseInt(req.params.id);
    employees.destroy({
        where: {id:id}
    }).then(num=>{
        if (num == 1){
            res.send({message: "Employee was deleted successfylly!"});
        }
        else{
            res.send({
                message: `Cannot delete employee with id= ${id}.`
            });
        }
    }).catch(err =>{
        res.status(500).send({message: "Could not delete the employee with id="+id});
    });  
};

export const updateEmployee =async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    
    employees.update(req.body, {
        where: { id: id }
      })
        .then(num => {
            
          if (num.includes(1)) {
            res.send({
              message: "Employee was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Employee with id=${id}. Maybe Employee was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Employee with id=" + id
          });
        });
    };


