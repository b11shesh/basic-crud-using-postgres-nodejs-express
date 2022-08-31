import jwt from "jsonwebtoken";
import config from "./auth.config";
import user from "../models/user";
import userrole from "../models/userrole";
import {addInErrorFile, IDecoded} from "../commonHelper"

import express from "express";
import userlogininfo from "../models/userlogininfo";


export const verifyToken = async(req:express.Request, res: express.Response, next: express.NextFunction)=>{
    try {
        const uuid = req.headers.authorization;
    console.log(uuid);
    if (!uuid){
        // const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string);
        // const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} \"!! No Token !!\" \n`

        // addInErrorFile(message);     
        return res.status(403).send({
            message: "No Token Provided!"
        });
    }
    // const verifyToken = jwt.verify(token as string, config.secret);
    const verifyToken = await userlogininfo.findOne({
        where:{jwttoken:uuid}
    })
    
    if (verifyToken){
        next();
    }else{
        // const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string);
        // const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} \"!! Unauthorized Token !!\" \n`

        // addInErrorFile(message);
        return res.status(404).send({
            message: "Unauthorized Token!!"
        });
    }
    } catch (error) {
        // const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string);
        // const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"!! Error Token !!\" \n`

        // addInErrorFile(message);
        return res.status(500).send({
            message: "Error Token!!"
        });
    }
    
};


export const isAdmin = async (req:express.Request, res: express.Response, next: express.NextFunction) => {
        // const token = req.headers.authorization?.split(" ")[1];

        // const verifyToken = jwt.verify(token as string, config.secret);

        // if (verifyToken){
        //     const decodedToken = jwt.decode(token as string) 

        //     if((decodedToken as IDecoded)?.role === 1){
        //         next()
        //     }
        //     else{
        //         return res.send({error: "Only Admin can access"})
        //     }
        // }  
        const token = req.headers.authorization;

        const role = await userlogininfo.findOne({
            where:{jwttoken: token}
        });
        if(role?.getDataValue('userroleid')===1){
            next();
        }
        else{
            return res.send({error: "Only Admin can access"})
        }
         
};


