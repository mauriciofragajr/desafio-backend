import express from 'express';
let categoriesRoute = express.Router();

import categoryController from '../controllers/categoryController';

categoriesRoute.get('/', categoryController.list);
categoriesRoute.post('/', categoryController.create);
categoriesRoute.delete('/:slug', categoryController.delete);

export default categoriesRoute;