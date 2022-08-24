import sequelize from "../dbConnection/database";
import { Op, QueryTypes } from 'sequelize';
import user from "../models/user";
import express from 'express';
import config from "../auth/auth.config";
import * as bcrypt from "bcryptjs";
let jwt = require("jsonwebtoken");
import userlogininfo from "../models/userlogininfo";
import userrole from "../models/userrole";
import * as fs from 'fs';
import { addInLogFile } from "../commonHelper";




export const signup = async (req: express.Request, res: express.Response)=>{
  console.log(req.body) 
    user.create({
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hashSync(req.body.password, 8)
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
  try {
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
      
                var token = jwt.sign({ id: users?.getDataValue('id'), role: users?.getDataValue("userroleid"), username: users?.getDataValue("username") }, config.secret, {
                  expiresIn: 86400 // 24 hours
                });
  
      userlogininfo.create({
          userid: users.getDataValue('id'),
          jwttoken: token,
          logindatetime: new Date(),            
      }).then(item=> console.log(item))         
      
      const loggedIn = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${users.getDataValue("id")} ${users.getDataValue("username").trim()} Logged In \n`

        // fs.writeFile(filename,"Daily Login File! \nDate Time HTTP Method Userid Username Remarks \n", (err)=>{
        //   if(err) console.log(err);
          
        // })    
        const date = new Date().toLocaleDateString().split("")
        for(let i=0; i< date.length; i++){ 
            if(date[i].includes("/")){ 
                date[i] = "_"
            } 
        }
      // const filename =`/ITH (NODE.JS)/crud/log/logfile_${date.join("")}.txt`
      // fs.readFile(filename, 'utf8',(err)=>{
      //       if(err) console.log(err);
          
      // } );

      addInLogFile( loggedIn);  
    
       
        return res.status(200).send({
          users: users,
          accessToken: token,
          message: "Logged in!!"
        });
      })

  } catch (error) {
    return res.send(error)
  }
  }


export const signout = (req:express.Request, res: express.Response)=>{
       try {
         const id = req.params.id

        //  const loggedOut = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${(verifyToken as IDecoded)?.id} ${(verifyToken as IDecoded)?.username.trim()} Logged Out \n`
       

         req.headers.authorization="";
       if(req.headers.authorization===""){

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
            message: error
         })
       }
       
}