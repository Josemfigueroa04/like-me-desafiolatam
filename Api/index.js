const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(cors());
app.use(express.json());
app.listen(3000, () => console.log('Server started'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: '22921748',
    port: 5432,
    allowExitOnIdle: true,

});

pool.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database');
    }
});


app.post('/posts', upload.single('img'), async (req, res) => {
    try {
        const { description } = req.body;
        const img = req.file.path;
        const connection = await pool.connect();
        const sql = 'INSERT INTO posts (url,description) VALUES ($1, $2)';
        const values = [img, description];
        await connection.query(sql, values);
        res.json({ message: 'Post created' });
        connection.release();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});
