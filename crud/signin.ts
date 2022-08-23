import sequelize from "../dbConnection/database";
import { Op, QueryTypes } from 'sequelize';
import user from "../models/user";
import express from 'express';
import config from "../auth/auth.config";
import * as bcrypt from "bcryptjs";
let jwt = require("jsonwebtoken");
import userlogininfo from "../models/userlogininfo";
import userrole from "../models/userrole";

export const signup = async (req: express.Request, res: express.Response)=>{
  console.log(req.body) 
    user.create({
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hashSync(req.body.password, 10)
    })
    .then(user =>{
      if(req.body.roles){
        userrole.findAll({
          where: {
            userroleid:  req.body.roles            
          }
        }).then(roles=>{
          sequelize.query(`UPDATE "user"
          SET userroleid = :roleid
          WHERE id = :id`,{
            replacements:{id: user.getDataValue("id"), roleid: roles[0]?.getDataValue('userroleid')  },
            type: QueryTypes.UPDATE
          }).then(data=> {return res.send({ message: "User was registered successfully!" });})
       })
      }

    }).catch(err=>{
        return res.status(500).send(err);
    });

};

export const signin = (req: express.Request, res: express.Response) =>{   
    user.findOne({
        where: {
            username: req.body.username
    }}).then(async(users)=>{     
        if (!users){
            return res.status(404).send({message: "invalid User Name."});
        }
        
  
      const passwordMatched = await  bcrypt.compareSync(
        req.body.password,
        users?.getDataValue('password')
    )
    if (passwordMatched){
      var token = jwt.sign({ id: users?.getDataValue('id'), role: users?.getDataValue("userroleid") }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

    userlogininfo.create({
        userid: users.getDataValue('id'),
        jwttoken: token,
        logindatetime: new Date(),            
    }).then(item=> console.log(item))          
     
      return res.status(200).send({
        users: users,
        accessToken: token,
        message: "Logged in!!"
      });
    } else{
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }
 }) 

}

export const signout = (req:express.Request, res: express.Response)=>{
       try {
        req.headers.authorization="";
       const id = req.params.id
       if(req.headers.authorization===""){

        // userlogininfo.update(req.body,{
        //     where:{userlogininfoid: id}
        // }).then(item=> console.log(item))

        sequelize.query(`UPDATE userlogininfo
        SET logoutdatetime = now() 
        WHERE userlogininfoid = :id`,{
          replacements:{id: id},
          type: QueryTypes.UPDATE
        }).then(item=>console.log(item))
      
        return res.status(200).send({
            message:"logged out"
        })
    }
       } catch (error) {
         return res.status(500).send({
            message: "error"
         })
       }
       
}