import department from "./department";
import express from 'express';

const app = express();
app.use(express.json());


export const getDepartment = async (req:express.Request, res:express.Response) =>{
    department.findAll()
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message: err.message || "Error occurred while retreiving data"
        });
    });
};

export const getDepartmentById =async (req:express.Request, res:express.Response) => {
    const id = parseInt(req.params.id);
    department.findByPk(id)
    .then(data =>{
        if (data){
            res.send(data);
        }else{
            res.status(404).send({
                message: "Error finding department with id="+ id
            });
        }
    })
    .catch(err => {
        res.status(500).send({
          message: "Error retrieving Deaprtment with id=" + id
        });
    });
    
};

export const createDepartment =async (req: express.Request, res:express.Response) => {
    department.create({
        id: req.body.id,
        name: req.body.name
    }).then(department=>{
        return res.send({message : "Department was successfully created"});
    }).catch(err=>{
        return res.status(500).send({message: err.message});
    });
};

export const updateDepartment =async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    
    department.update(req.body, {
        where: { id: id }
      })
        .then(num => {
            console.log(num)
          if (num.includes(1)) {
            res.send({
              message: "Department was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Department with id=${id}. Maybe Employee was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Department with id=" + id
          });
        });
    };

    export const deleteDepartment = async ( req: express.Request, res: express.Response)=>{
        const id= parseInt(req.params.id);
        department.destroy({
            where: {id:id}
        }).then(num=>{
            if (num == 1){
                res.send({message: "Department was deleted successfylly!"});
            }
            else{
                res.send({
                    message: `Cannot delete department with id= ${id}.`
                });
            }
        }).catch(err =>{
            res.status(500).send({message: "Could not delete the department with id="+id});
        });  
    };