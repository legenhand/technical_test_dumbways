const express = require('express');
const app = express();
const port = 8080;
const db = require('./connection/db');
const upload = require('./middlewares/uploadFile');

app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(express.urlencoded({ extended: false }));

// Routing GET
app.get('/', (req, res) => {

    db.query('SELECT * FROM provinsi_tb', (error, results, fields) => {
        res.render('index', { provinsi: results });
    });
});

app.get('/detail-provinsi/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM provinsi_tb WHERE id = '${id}'`, (error, results, fields) => {
        res.render('detail-provinsi', { provinsi: results[0] });
    });
});

app.get('/kabupaten', (req, res) => {
    db.query('SELECT * FROM kabupaten_tb', (error, results, fields) => {
        res.render('kabupaten', { data: results });
    });
});

app.get('/detail-kabupaten/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM kabupaten_tb WHERE id = '${id}'`, (error, results, fields) => {
        res.render('detail-kabupaten', { kabupaten: results[0] });
    });
});


// Add provinsi
app.get('/add-provinsi', (req, res) => {
    res.render('add-provinsi');
});


// Routing POST
app.post('/add-provinsi', upload.single('upload-image'), (req, res) => {
    let data = {
        nama: req.body.nama,
        diresmikan: req.body.diresmikan,
        pulau: req.body.pulau,
        photo: req.file.filename,
    };

    db.query(`INSERT INTO provinsi_tb (nama,diresmikan, photo, pulau) VALUES ('${data.nama}', '${data.diresmikan}', '${data.photo}', '${data.pulau}') ` , (error, results, fields) => {
        res.redirect('/');
    });
});

app.get('/update-provinsi/:id', upload.single('upload-image'), (req,res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM provinsi_tb WHERE id = '${id}'`, (error, results, fields) => {
        res.render('update-provinsi', { provinsi: results[0] });
    });
})
// Routing POST
app.post('/update-provinsi/:id', upload.single('upload-image'), (req, res) => {
    const {id } = req.params;
    let data = {
        nama: req.body.nama,
        diresmikan: req.body.diresmikan,
        pulau: req.body.pulau,
        photo: req.file.filename,
    };
        db.query(`UPDATE provinsi_tb SET nama='${data.nama}', diresmikan='${data.diresmikan}', pulau='${data.pulau}', photo='${data.photo}' WHERE id=${id} `, (error, results, fields) => {
        res.redirect('/');
    });
});
// delete provinsi
app.get('/delete-provinsi/:id', (req, res) => {
    const {id} = req.params;
    db.query(`DELETE FROM provinsi_tb WHERE id = ${id}`,(err,results , fields) => {
        res.redirect('/');
    });
});


app.listen(port, () => {
    console.log(`Server running on 127.0.0.1:${port}`);
})

