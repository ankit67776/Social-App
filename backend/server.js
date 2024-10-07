const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const path = require('path');

const app = express();
app.use(cookieParser());

app.use(cors({
    origin : 'http://localhost:3001',
    credentials : true
}));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

const PORT = 3000;

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes);

// serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Database connection
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);;
});

