import department from "../models/department";
import express from 'express';
import { addInErrorFile, addInLogFile, GenericType, getPagination, getPagingData } from "../commonHelper";
import { Model } from "sequelize";
import sequelize from "../dbConnection/database";
import { IDecoded } from "../commonHelper";
import * as jwt from "jsonwebtoken"

const app = express();
app.use(express.json());


export const getDepartment = async (req:express.Request, res:express.Response) =>{
    
    const page:number = parseInt(req.query.pageNo as string);
    const size:number = parseInt(req.query.pageSize as string);
    const searchedName = req.query.search;
    const {limit, offset} = getPagination(page,size);
    const dep = await department.findAll();
    department.findAndCountAll({
        where: {
            name: searchedName ? sequelize.where(sequelize.fn('Lower', sequelize.col('name')), "LIKE", "%" + searchedName + "%"): dep.map((item)=> item.getDataValue('name')) 
        },
        limit,
        offset
    })
    .then(data =>{
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

        const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Get Department API\" \n`

        addInLogFile(message);

        const response = getPagingData(data,page,limit);
        return res.send(response);
    })
    .catch(err =>{
         const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

          const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

          addInErrorFile(message);
        return res.status(500).send({
            message: err.message || "Error occurred while retreiving data"
        });
    });
};


export const getDepartmentById =async (req:express.Request, res:express.Response) => {
    const id = parseInt(req.params.id);
    department.findByPk(id)
    .then(data =>{
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 
        if (data){
            

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Get Department By ID API\" \n`

            addInLogFile(message);

           return res.send(data);
        }else{
            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Error in Get Department By ID API" \n`

              addInErrorFile(message);
            return res.status(404).send({
                message: "Error finding department with id="+ id
            });
        }
    })
    .catch(err => {
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

          const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

          addInErrorFile(message);
        return res.status(500).send({
          message: "Error retrieving Deaprtment with id=" + id
        });
    });
    
};

export const createDepartment =async (req: express.Request, res:express.Response) => {
    department.create({
        id: req.body.id,
        name: req.body.name
    }).then(department=>{
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

        const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Create Department API\" \n`

        addInLogFile(message);

        return res.send({message : "Department was successfully created"});
    }).catch(err=>{
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

          const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

          addInErrorFile(message);
        return res.status(500).send({message: err.message});
    });
};

export const updateDepartment =async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    
    department.update(req.body, {
        where: { id: id }
      })
        .then(num => {
         const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string);
          if (num.includes(1)) {
             

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Update Department API\" \n`

            addInLogFile(message);

            return res.send({
              message: "Department was updated successfully."
            });
          } else {
            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Error in Update Department API" \n`

            addInErrorFile(message);

            return res.send({
              message: `Cannot update Department with id=${id}. Maybe Employee was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
            const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

            addInErrorFile(message);

          return res.status(500).send({
            message: "Error updating Department with id=" + id
          });
        });
    };

    export const deleteDepartment = async ( req: express.Request, res: express.Response)=>{
        const id= parseInt(req.params.id);
        department.destroy({
            where: {id:id}
        }).then(num=>{
            const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string);
                if (num == 1){
                     

                    const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Delete Department API\" \n`

                    addInLogFile(message);

                    return res.send({message: "Department was deleted successfylly!"});
                }
                else{
                    const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Error in Delete Department API" \n`

                    addInErrorFile(message);
                    return res.status(424).send({
                        message: `Cannot delete department because the Foreign Key Dependency Exists!!`
                    });
                }
            
        }).catch(err =>{
            const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

            addInErrorFile(message);
            return res.status(500).send({message: "Could not delete the department with id="+id});
        });  
    };