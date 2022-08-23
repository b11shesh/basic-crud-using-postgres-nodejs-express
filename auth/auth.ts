import jwt, {JwtPayload} from "jsonwebtoken";
import config from "./auth.config";
import user from "../models/user";
import userrole from "../models/userrole";

import express from "express";


export const verifyToken = async(req:express.Request, res: express.Response, next: express.NextFunction)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
    
    if (!token){
        return res.status(403).send({
            message: "No Token Provided!"
        });
    }
    const verifyToken = jwt.verify(token as string, config.secret);
    
    if (verifyToken){
        next();
    }else{
        return res.status(404).send({
            message: "Unauthorized Token!!"
        });
    }
    } catch (error) {
        return res.status(500).send({
            message: "Error Token!!"
        });
    }
    
    
};

interface IDecoded{
    id: string,
    role: number,
}

export const isAdmin =async (req:express.Request, res: express.Response, next: express.NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        const verifyToken = jwt.verify(token as string, config.secret);

        if (verifyToken){
        const decodedToken = jwt.decode(token as string) 

        if((decodedToken as IDecoded)?.role === 2){
            next()
        }else{
            return res.send({error: "Only Admin can access"})
        }
        }
         
        
};


