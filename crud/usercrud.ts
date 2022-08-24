import user from "../models/user";
import userrole from "../models/userrole";
import express from 'express';
import sequelize from "../dbConnection/database";
import { addInErrorFile, addInLogFile, IDecoded } from "../commonHelper";
import * as jwt from "jsonwebtoken";


const app = express();
app.use(express.json());


export const getUserInfo =async (req:express.Request, res: express.Response) => {
    user.belongsTo(userrole, {foreignKey: 'userroleid'});
    userrole.hasMany(user, {foreignKey: 'userroleid'});
    user.findAll({
        include: [userrole]
    }).then(user=>{
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

        const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Get Employee API\" \n`

        addInLogFile(message);
        return res.status(200).send(user);
    }).catch(err=>{
            const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

            addInErrorFile(message);
        return res.status(500).send({
            message: err.message
        });
    })
    
}