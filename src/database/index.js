import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, (err) => {
    if (err) throw err;
    console.log(chalk.green('mongo db connected..'));
});

export default mongoose;