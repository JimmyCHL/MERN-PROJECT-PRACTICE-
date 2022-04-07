import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const CONNECTION_URL = process.env.CONNECTION_URL;

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('App is running');
});

mongoose
    .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log('Error connecting to database'));

// mongoose.set("useFindAndModify", false);
//Mongoose version 6+ no longer supports useFindAndModify.
//We can delete this sentense if you got an error like memongoose.set('useFindAndModify', false);