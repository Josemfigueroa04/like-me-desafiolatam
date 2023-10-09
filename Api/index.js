const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.listen(5000, () => console.log('Server started'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('img');

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


app.post('/posts', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
        }
        const { titulo, descripcion } = req.body;
        const img = req.file.path;

        try {
            const query = 'INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *';
            const values = [titulo, img, descripcion]; 
            const { rows } = await pool.query(query, values);
            res.json(rows[0]);
            console.log(`Post insertado con éxito  `);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    })
});

app.get('/posts', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM posts');
        res.json(rows);
        console.log(`Post obtenido con éxito `);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// app.delete('/posts/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const connection = await pool.connect();
//         const sql = 'DELETE FROM posts WHERE id = $1';
//         const values = [id];
//         await connection.query(sql, values);
//         res.json({ message: 'Post deleted' });
//         connection.release();


//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

app.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.connect();
        const { rows } = await connection.query('SELECT img FROM posts WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const imgPath = rows[0].img;
        fs.unlink(imgPath, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: err.message });
            }
            const sql = 'DELETE FROM posts WHERE id = $1';
            const values = [id];
            await connection.query(sql, values);
            res.json({ message: 'Post deleted' });
        });
        connection.release();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/posts/like/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT likes FROM posts WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el post.' });
        }
        const likes = rows[0].likes + 1;
        await pool.query('UPDATE posts SET likes = $1 WHERE id = $2', [likes, id]);
        res.json({ message: 'Like agregado con éxito.' });
        console.log(`Like agregado con éxito`);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

