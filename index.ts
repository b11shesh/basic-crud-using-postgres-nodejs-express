import express from 'express';
import sequelize from './database';
import Router from './router';

const app = express();
app.use(express.json());

app.use(Router);

app.listen(5000, () => console.log('Server running at http://localhost:5000'));