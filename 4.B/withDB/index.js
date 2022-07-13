const express = require('express');
const app = express();
const port = 8082;
const db = require('./connection/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const upload = require('./middlewares/uploadFile');




app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(express.urlencoded({ extended: false }));

app.use(flash());

app.use(
    session({
        secret: 'rahasia',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 2 },
    })
);


// FOR TESTING ONLY

app.get('/test', (req, res) => {


});


// Routing GET
app.get('/', (req, res) => {
    db.connect(function(err, client, done) {
        if (err) throw err;
        let query;
        if (req.session.isLogin) {
            query = `SELECT tb_projects.*, tb_user.id as user_id, tb_user.name as author_name
                FROM tb_projects
                LEFT JOIN tb_user
                ON tb_projects.author_id = tb_user.id
                WHERE tb_user.id = ${req.session.user.id};`
        } else {
            query = `SELECT tb_projects.*, tb_user.id as user_id, tb_user.name as author_name
                FROM tb_projects
                LEFT JOIN tb_user
                ON tb_projects.author_id = tb_user.id;`
        }

        client.query(query, function(err, result) {
            if (err) throw err;

            let projectsData = result.rows;
            let name = '';
            if (req.session.isLogin) {
                name = req.session.user.name;
            }
            projectsData = processDataProjects(projectsData, false, req.session.isLogin);
            res.render('index', { projects: projectsData, isLogin: req.session.isLogin, name: name });
        });
        done();
    });
});

app.get('/contact-me', (req, res) => {
    res.render('contact-me', { isLogin: req.session.isLogin });
});

app.get('/project', (req, res) => {
    if (!req.session.isLogin) {
        req.flash('error', 'Please Login First!')
        res.redirect('/')
    }
    res.render('project', { isLogin: req.session.isLogin });
});

app.get('/project-detail/:id', (req, res) => {
    db.connect(function(err, client, done) {
        if (err) throw err;
        const id = req.params.id;
        const query = `SELECT * FROM tb_projects where id = ${id}`;

        client.query(query, function(err, result) {
            if (err) throw err;

            const projectsData = result.rows;
            let data = processDataProjects(projectsData);
            res.render('project-detail', { data: data[0], isLogin: req.session.isLogin });
        });
        done();
    });
});

app.get('/project-update/:id', (req, res) => {
    if (!req.session.isLogin) {
        req.flash('error', 'Please Login First!')
        res.redirect('/')
    }
    db.connect(function(err, client, done) {
        if (err) throw err;
        const id = req.params.id;
        const query = `SELECT id, name, TO_CHAR(start_date, 'yyyy-mm-dd') as start_date, TO_CHAR(end_date, 'yyyy-mm-dd') as end_date, description, technologies, image
	FROM tb_projects where id=${id};`;

        client.query(query, function(err, result) {
            if (err) throw err;

            const projectsData = result.rows;
            let data = processDataProjects(projectsData, true);
            res.render('project-update', { data: data[0], isLogin: req.session.isLogin }, );
        });
        done();
    });
});

app.get('/delete-project/:id', (req, res) => {
    if (!req.session.isLogin) {
        req.flash('error', 'Please Login First!')
        res.redirect('/')
    } else {
        db.connect(function(err, client, done) {
            if (err) throw err;
            const id = req.params.id;
            const query = `DELETE FROM tb_projects where id = ${id}`;

            client.query(query, function(err, result) {
                if (err) throw err;
                req.flash('success', 'Projects deleted!')
                res.redirect('/');
            });
            done();
        });
    }


});

app.get('/login', (req, res) => {
    if (req.session.isLogin) {
        req.flash('error', 'You Already login!')
        res.redirect('/')
    } else {
        res.render('login', { isLogin: req.session.isLogin });
    }
});

app.get('/register', (req, res) => {
    if (req.session.isLogin) {
        req.flash('error', 'You Already login!')
        res.redirect('/')
    } else {
        res.render('register', { isLogin: req.session.isLogin });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Routing POST
app.post('/add-project', upload.single('upload-image'), (req, res) => {
    if (!req.session.isLogin) {
        req.flash('error', 'Please Login First!')
        res.redirect('/')
    }
    let data = {
        name: req.body.name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        description: req.body.description,
        technologies: [],
        image: req.file.filename,
        author_id: req.session.user.id

    };

    if (req.body.nodejs) {
        data.technologies.push('nodejs');
    }
    if (req.body.reactjs) {
        data.technologies.push('reactjs');
    }
    if (req.body.nextjs) {
        data.technologies.push('nextjs');
    }
    if (req.body.typescript) {
        data.technologies.push('typescript');
    }
    db.connect(function(err, client, done) {
        if (err) throw err;
        const query = `INSERT INTO tb_projects(
            name, start_date, end_date, description, technologies, image, author_id)
            VALUES ('${data.name}', '${data.start_date}', '${data.end_date}', '${data.description}', '{${data.technologies.toString()}}', '${data.image}', '${data.author_id}');`;

        client.query(query, function(err, result) {
            if (err) throw err;
            req.flash('success', 'Your Project has been added!')
            res.redirect('/', );
        });
        done();
    });
});

app.post('/project-update/:id', upload.single('image'), (req, res) => {
    if (!req.session.isLogin) {
        req.flash('error', 'Please Login First!')
        res.redirect('/')
    }
    let data = {
        name: req.body.name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        description: req.body.description,
        technologies: [],
        image: req.file.filename
    };

    if (req.body.nodejs) {
        data.technologies.push('nodejs');
    }
    if (req.body.reactjs) {
        data.technologies.push('reactjs');
    }
    if (req.body.nextjs) {
        data.technologies.push('nextjs');
    }
    if (req.body.typescript) {
        data.technologies.push('typescript');
    }
    db.connect(function(err, client, done) {
        let id = req.params.id
        if (err) throw err;
        const query = `UPDATE tb_projects
                            SET name='${data.name}', start_date='${data.start_date}', end_date='${data.end_date}', description='${data.description}', technologies='{${data.technologies.toString()}}', image='${data.image}'
                            WHERE id=${id};`;

        client.query(query, function(err, result) {
            if (err) throw err;
            req.flash('success', 'Your Project has been updated!')
            res.redirect('/');
        });
        done();
    });
});



// Routing POST for register and login

app.post('/register', (req, res) => {
    let encryptedPassword = bcrypt.hashSync(req.body.password, 10);
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword
    };
    db.connect(function(err, client, done) {
        if (err) throw err;
        const query = `INSERT INTO tb_user(
            name, email, password)
            VALUES ('${data.name}', '${data.email}', '${data.password}');`;

        client.query(query, function(err, result) {
            if (err) {
                res.redirect('/register');
            } else {
                res.redirect('/login');
            }

        });
        done();
    });
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // if (email == '' || password == '') {
    //     req.flash('warning', 'Please insert all fields');
    //     return res.redirect('/login');
    // }

    db.connect(function(err, client, done) {
        if (err) throw err;

        const query = `SELECT * FROM tb_user WHERE email = '${email}';`;

        client.query(query, function(err, result) {
            if (err) throw err;

            const data = result.rows;

            if (data.length == 0) {
                req.flash('error', 'Email or Password not Match');
                return res.redirect('/login');
            }

            const isMatch = bcrypt.compareSync(password, data[0].password);

            if (isMatch == false) {
                req.flash('error', 'Email or Password not Match');
                return res.redirect('/login');
            }

            req.session.isLogin = true;
            req.session.user = {
                id: data[0].id,
                email: data[0].email,
                name: data[0].name,
            };

            req.flash('success', `Welcome, <b>${data[0].email}</b>`);

            res.redirect('/');
        });

        done();
    });
});

// Start express app
app.listen(port, () => {
    console.log(`Server running on 127.0.0.1:${port}`);
})

// function tambahan

function getDateDifference(startDate, endDate) {
    if (startDate > endDate) {
        console.error('Start date must be before end date');
        return null;
    }
    let startYear = startDate.getFullYear();
    let startMonth = startDate.getMonth();
    let startDay = startDate.getDate();

    let endYear = endDate.getFullYear();
    let endMonth = endDate.getMonth();
    let endDay = endDate.getDate();

    let february = (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;
    let daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let startDateNotPassedInEndYear = (endMonth < startMonth) || endMonth == startMonth && endDay < startDay;
    let years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);

    let months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;

    let days = startDay <= endDay ? endDay - startDay : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;

    return {
        years: years,
        months: months,
        days: days
    };
}


function updateProjects(id, data) {
    let elementIndex = projects.findIndex(item => item.id == id);
    projects[elementIndex].name = data.name;
    projects[elementIndex].start_date = data.start_date;
    projects[elementIndex].end_date = data.end_date;
    projects[elementIndex].description = data.description;
    projects[elementIndex].lengthDate = getDateDifference(new Date(data.start_date), new Date(data.end_date));
}

function processDataProjects(data, isUpdate = false, isLogin = false) {
    const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    data.map((x) => {
        x.lengthDate = getDateDifference(new Date(x.start_date), new Date(x.end_date));
        x.start_date = isUpdate ? x.start_date : x.start_date.toLocaleDateString('id-ID', dateFormatOptions);
        x.end_date = isUpdate ? x.end_date : x.end_date.toLocaleDateString('id-ID', dateFormatOptions);
        x.isLogin = isLogin;
        if (x.technologies.includes("nodejs")) {
            x.technologies.nodejs = true;
        }
        if (x.technologies.includes("reactjs")) {
            x.technologies.reactjs = true;
        }
        if (x.technologies.includes("nextjs")) {
            x.technologies.nextjs = true;
        }
        if (x.technologies.includes("typescript")) {
            x.technologies.typescript = true;
        }
    })
    return data;
}