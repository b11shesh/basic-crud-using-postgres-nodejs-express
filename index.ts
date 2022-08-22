import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import Router from './router/router';

const app = express();
app.use(express.json());

app.use(Router);
const swaggerOptions={
    definition:{
        openapi: '3.0.0',
        info:{
            title: 'Employee Management API',
            version: '1.0.0',
            description:'Employee API for employee management',
            contact:{
                name: 'Bishesh Upadhyaya',
                email: 'ubish7@gmail.com'
            },
            servers:["http://localhost:4000"]
        },
        components:{
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
            },
        }
    },
    apis:[__filename]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocs));


app.listen(4000, () => console.log('Server running at http://localhost:4000'));

//Swagger of each and every API

/**
 * @swagger
 * tags:
 *  name: Employees API
 *  description: APIs to handle employee resources
 *  
 * */ 

/**
 * @swagger
 * tags:
 *  name: Department API
 *  description: APIs to handle department resources
 *  
 * */ 

/**
 * @swagger
 * tags:
 *  name: User API
 *  description: APIs to handle user resources
 *  
 * */ 

/** 
 * @swagger
 * definitions:
 *  Employees:
 *   type: object
 *   properties:
 *    id:
 *     type: integer
 *     description: id of the employee
 *     example: '1'
 *    name:
 *     type: string
 *     description: name of the employee
 *     example: 'Ram'
 *    address:
 *     type: string
 *     description: address of the employee
 *     example: 'Kathmandu' 
 *    contact:
 *     type: string
 *     description: contact of the employee
 *     example: '121321112'
 *    dob:
 *     type: string
 *     description: birthdate of the employee
 *     example: '1998-03-12'
 *    departmentid:
 *     type: integer
 *     description: department of the employee
 *     example: '2' 
 *    supervisorid:
 *     type: integer
 *     description: supervisorid of the employee
 *     example: '1'  
 *  Department:
 *   type: object
 *   properties:
 *    id:
 *     type: integer
 *     description: id of the department
 *     example: '1'
 *    name:
 *     type: string
 *     description: name of the deparmtent
 *     example: 'Finance'
 *  User:
 *   type: object
 *   properties:
 *    id:
 *     type: integer
 *     description: id of the user
 *     example: '1'
 *    username:
 *     type: string
 *     description: username of the user
 *     example: 'bishesh'
 *    password:
 *     type: string
 *     description: encrypted password 
 *     example: '$2a$08$PDeldP55k1JR43NaVdImOuSD0z4MYUHVgcMSQATgGHhCs/PWGftzO'
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'ubish7@gmail.com'
 */  

/**
 * @swagger
 * /employees:
 *  post:
 *   summary: create employee
 *   tags: [Employees API]
 *   security:
 *    - bearerAuth: [] 
 *   description: create employlee for the organisation
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Employees'
 *   responses:
 *    200:
 *     description: employee created successfully
 *    500:
 *     description: failure in creating employee
 */

/**
 * @swagger
 * /employees:
 *  get:
 *   summary: get all employee
 *   tags: [Employees API]
 *   security:
 *    - bearerAuth: [] 
 *   description: get all employlee of the organisation
 *   responses:
 *    200:
 *     description: Successfully Get all Employees
 *    403:
 *     description: No token provided
 *    500:
 *     description: failure in getting employee
 */

/**
 * @swagger
 * /departments:
 *  get:
 *   summary: get all department
 *   tags: [Department API]
 *   security:
 *    - bearerAuth: [] 
 *   description: get all department for the organisation
 *   responses:
 *    200:
 *     description: Successfully Get all Department
 *    403:
 *     description: No token provided
 *    500:
 *     description: failure in getting Department
 */

/**
 * @swagger
 * /employees/{id}:
 *  get:
 *   summary: get employee
 *   tags: [Employees API]
 *   security:
 *    - bearerAuth: []
 *   description: get employee
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: Success
 *    403:
 *     description: No token Provied
 *    500:
 *     description: Fail
 */

/**
 * @swagger
 * /departments/{id}:
 *  get:
 *   summary: get department
 *   tags: [Department API]
 *   security:
 *    - bearerAuth: [] 
 *   description: get department
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the department
 *      example: 2
 *   responses:
 *    200:
 *     description: Success
 *    403:
 *     description: No token Provied
 *    500:
 *     description: Fail
 */

/**
 * @swagger
 * /employees/{id}:
 *  put:
 *   summary: update employee
 *   tags: [Employees API]
 *   security:
 *    - bearerAuth: [] 
 *   description: update employee
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/Employees'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Employees'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Department'
 */

/**
 * @swagger
 * /departments/{id}:
 *  put:
 *   summary: update department
 *   tags: [Department API]
 *   security:
 *    - bearerAuth: [] 
 *   description: update department
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the department
 *      example: 2
 *    - in: body
 *      name: body
 *      required: true
 *      description: body object
 *      schema:
 *       $ref: '#/definitions/Department'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Department'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Department'
 */

/**
 * @swagger
 * /employees/{id}:
 *  delete:
 *   summary: delete employee
 *   tags: [Employees API]
 *   security:
 *    - bearerAuth: [] 
 *   description: delete employee
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the employee
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /departments/{id}:
 *  delete:
 *   summary: delete department
 *   tags: [Department API]
 *   security:
 *    - bearerAuth: [] 
 *   description: delete department
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: id of the department
 *      example: 2
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /signin:
 *  post:
 *      tags: [User API]
 *      summary: "Returns Authorization Token"
 *      description: "Authorizes default users with username and password set as root to use the endpoints"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: "Authorization token"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "data": "token"
 *
 */

/**
 * @swagger
 * /departments:
 *  post:
 *   summary: create department
 *   tags: [Department API]
 *   security:
 *    - bearerAuth: [] 
 *   description: create department for the organisation
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Department'
 *   responses:
 *    200:
 *     description: Department created successfully
 *    500:
 *     description: failure in creating Department
 */