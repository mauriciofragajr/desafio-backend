import express from 'express';
let categoriesRoute = express.Router();

import categoryController from '../controllers/categoryController';

categoriesRoute.get('/', categoryController.list);
categoriesRoute.post('/', categoryController.create);
categoriesRoute.put('/', categoryController.update);
categoriesRoute.delete('/', categoryController.delete);

export default categoriesRoute;