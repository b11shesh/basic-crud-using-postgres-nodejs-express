import sequelize from "./database";
import user from "./user";
import express from 'express';
import config from "./auth.config";
import * as bcrypt from "bcryptjs";
let jwt = require("jsonwebtoken");

export const signup = (req: express.Request, res: express.Response)=>{
    console.log(req.body)
    user.create({
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hash(req.body.password, 8)

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
          return res.status(200).send({
            accessToken: token,
            message: "Logged in!!"
          });

    }) 
    
}