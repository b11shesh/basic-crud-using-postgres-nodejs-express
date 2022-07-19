import express from 'express';
import morgan from 'morgan';
require('dotenv').config();

const app = express();
const port = process.env.PORT;
import {Pool, PoolClient} from "pg";

let pool = new Pool();

app.use(morgan('dev'));
//to parse the request
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) =>{
    res.send(`<!DOCTYPE <!DOCTYPE html>

    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Document</title>
            
        </head>
        <body>
            <form action = "/info/get" method = "GET">
                <input type ="submit" value="GET">
            </form>
            <form action = "/info/add" method = "POST">
                <label for="add">Name:</label>
                <input type="text" name="add" id="add">
                <input type ="submit" value="ADD">
            </form>
            <form action = "/info/delete" method = "POST">
                <label for="delete">Delete:</label>
                <input type="text" name="delete" id="delete">
                <input type ="submit" value="DELETE">
            </form>
            <form action = "/info/update" method = "POST">
                <label for="oldValue">Old Value:</label>
                <input type="text" name="oldValue" id="oldValue">
                <label for="newValue">New Value:</label>
                <input type="text" name="newValue" id="newValue">
                <input type ="submit" value="UPDATE">
            </form>
            
            
        </body>
    </html>`);
})

app.get('/info/get', (req: express.Request, res: express.Response)=>{
    try{
        pool.connect(async(error: Error, client: PoolClient, release)=>{
            let resp = await client.query(`SELECT * FROM demo_table`);
            release();
            res.send(resp.rows);
         })
    }
    catch(error){
        console.log(error);
    }
});
app.post('/info/add', (req: express.Request,res: express.Response)=>{
   
    try{
        pool.connect(async(error: Error, client: PoolClient, release)=>{
            let resp = await client.query(`INSERT INTO demo_table (name) VALUES ('${req.body.add}')`);
            
            res.redirect('/info/get');
        })
    }
    catch(error){
        console.log(error);
    }
});
app.post('/info/delete', (req: express.Request ,res: express.Response)=>{
   
    try{
        pool.connect(async(error : Error, client: PoolClient, release)=>{
            let resp = await client.query(`DELETE FROM demo_table WHERE name = '${req.body.delete}'`);
            
            res.redirect('/info/get');
        })

    }
    catch(error){
        console.log(error);
    }
});
app.post('/info/update', (req: express.Request,res: express.Response)=>{
   
    try{
        pool.connect(async(error: Error, client: PoolClient, release)=>{
            let resp = await client.query(`UPDATE demo_table set name = '${req.body.newValue}' WHERE name = '${req.body.oldValue}'`);
            
            res.redirect('/info/get');
        })

    }
    catch(error){
        console.log(error);
    }
});

app.listen(port, ()=>{
    console.log(`server started on ${port}`);

});