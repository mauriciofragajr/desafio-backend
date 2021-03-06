// CORE ITEMS
import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import cors from 'cors';
// ROUTES
import homeRoute from './routes/home';
import categoriesRoute from './routes/categories';
import postsRoute from './routes/posts';
// MIDDLEWARES
import log from './middlewares/log';

let app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

app.use(log);
app.use('/', homeRoute);
app.use('/categories', categoriesRoute);
app.use('/posts', postsRoute);

app.set('port', process.env.PORT || 8085);

app.listen(app.get('port'), function () {
    console.log(`Blog backend listening on port ${app.get('port')}!`)
});