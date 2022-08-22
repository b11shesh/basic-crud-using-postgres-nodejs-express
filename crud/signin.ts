import sequelize from "../dbConnection/database";
import { Sequelize, QueryTypes } from 'sequelize';
import user from "../models/user";
import express from 'express';
import config from "../auth/auth.config";
import * as bcrypt from "bcryptjs";
let jwt = require("jsonwebtoken");
import * as crypto from "crypto";
import userlogininfo from "../models/userlogininfo";

export const signup = (req: express.Request, res: express.Response)=>{
    console.log(req.body);
    user.create({
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    .then(user =>{
       return res.send({ message: "User was registered successfully!" });
    }).catch(err=>{
        return res.status(500).send({message: err.message});
    });

};

export const signin = (req: express.Request, res: express.Response) =>{   
    user.findOne({
        where: {
            username: req.body.username
    }}).then((users)=>{     
        if (!users){
            return res.status(404).send({message: "invalid User Name."});
        }
        let passwordIsValid = bcrypt.compare(
            req.body.password,
            users?.getDataValue('password')
        )
        if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
        }
          var token = jwt.sign({ id: users?.getDataValue('id') }, config.secret, {
            expiresIn: 86400 // 24 hours
          });
          
        //   sequelize.query(`
        //   INSERT INTO userlogininfo(userlogininfoid, userid, jwttoken, guid, logindatetime, logoutdatetime ) VALUES (${Math.floor(Math.random() * 100)}, ${users.getDataValue('id')}, ${token}, ${crypto.randomUUID()}, ${new Date().toLocaleDateString()}, ${new Date().toLocaleDateString()} )`, {type: QueryTypes.INSERT})

        userlogininfo.create({
            userlogininfoid: Math.floor(Math.random() * 100),
            userid: users.getDataValue('id'),
            jwttoken: token,
            guid: crypto.randomUUID(),
            logindatetime: new Date(),
            // logoutdatetime: new Date(),            
        }).then(item=> console.log(item))          
         
          return res.status(200).send({
            users: users,
            accessToken: token,
            message: "Logged in!!"
          });        
          

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