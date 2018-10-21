var express = require('express');
var pgp = require('pg-promise')(/*options*/)
var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://weaclbeiwbxfsq:27abbf9f549e54ea47de0b0e387e2d77cea04352f95426ccc713a672b1fcdb65@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d1himi9nqbifnr?ssl=true')
var app = express();
var moment = require('moment');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/index', function (req, res) {
    res.render('pages/index');
});
//product
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products order by id ASC';
    if (id) {
        sql += ' where id =' + id + 'order by id ASC';
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//user
app.get('/users', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var id = req.param('id');
    var sql = 'select * from users  order by id ASC';
    if (id) {
        sql += ' where id =' + id + 'order by id ASC';
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//productpid
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from products where id =" + pid + 'order by id asc';
    

    db.any(sql)
        .then(function (data) {

            res.render('pages/product_edit', { product: data[0], time: times });

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});
//user pid
app.get('/users/:pid', function (req, res) {
    var pid = req.params.pid;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from users where id =" + pid;

    db.any(sql)
        .then(function (data) {

            res.render('pages/user_edit', { user: data[0], time: times });

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })

});

//update product_edit
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}',price = '${price}' where id = '${id}' `;
    //db.none
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});



//user
app.get('/users/:id', function (req, res) {

    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//update user_edit
app.post('/user/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;

    var sql = `update users set email = '${email}', password = '${password}' where id = '${id}' `;
    db.none(sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//delete product button
app.get('/product_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//delete user button
app.get('/user_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//addnewproduct
app.get('/newproduct', function (req, res) {
    res.render('pages/addnewproduct');
})
app.post('/addnewproduct', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id, title, price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})
//addnewuser
app.get('/newuser', function (req, res) {
    res.render('pages/addnewuser');
})

app.post('/addnewuser', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `INSERT INTO users (id, email, password)
    VALUES ('${id}', '${email}', '${password}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
// report
app.get('/report_product', function (req, res) {
    
    var sql = 'select * from products order by price DESC limit 15';
    
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/reports_product', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })





});
//datetime
// app.post('/datetime', function (req, res) {
//     res.render('pages/addnewuser');
// })




var port = process.env.PORT || 8081;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});
