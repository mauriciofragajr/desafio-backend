import express from 'express';
let postsRoute = express.Router();

import postController from '../controllers/postController';

postsRoute.get('/', postController.list);
postsRoute.get('/:slug', postController.detail);
postsRoute.get('/categories/:slug', postController.listByCategory);
postsRoute.post('/', postController.create);
postsRoute.delete('/:slug', postController.delete);
postsRoute.put('/:slug', postController.update);

export default postsRoute;