var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var path = require('path');
var events = require('events')


var i = 1;
var CUS_FNAME = []
var CUS_LNAME = []
var mobileno = []
var total_amt = 0;
var f1 = [];
var f2 = [];
var eventEmitter = new events.EventEmitter();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sibi',
    database: 'food_del'
});
connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Hello connected!!');
});


var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());


//app.get('/', function(request, response) {
//   response.sendFile(path.join(__dirname + '/login.html'));
//});

//app.use(express.static(path.join(__dirname, 'N')))

//app.use(express.urlencoded());
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (request, response) => {
    response.render('login.html')
})

app.post('/sign', function(request, response) {
    response.render('signup.html');
})

app.post('/auth', function(request, response) {
    mobileno = request.body.mobileno;
    var password = request.body.password;
    if (mobileno && password) {
        connection.query('SELECT * FROM accounts WHERE mobileno = ? AND password = ?', [mobileno, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.mobileno = mobileno;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        // response.send('Welcome back, ' + request.session.mobileno + '!');
        //response.render('index.hbs', { Name: 'Sibi' })
        response.render('food.html')
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.post('/signup1', function(request, response) {
    var f1 = request.body.fname;
    var f2 = request.body.lname;
    var f3 = request.body.mob_no;
    var f4 = request.body.password1;
    var f5 = request.body.bdate;
    var f6 = request.body.hno;
    var f7 = request.body.street;
    var f8 = request.body.area;
    var f9 = request.body.pcode;
    var f10 = request.body.lmark;
    var f11 = request.body.mem;


    connection.query("INSERT INTO accounts(mobileno,password,Cus_fname) VALUES ( " + f3 + " , '" + f4 + "','" + f1 + "');", (err, value) => {
        if (err) {
            throw (err);
        } else
            connection.query("INSERT INTO cus_details(MOB_NO,CUS_FNAME,CUS_LNAME,BDATE) VALUES ( " + f3 + " , '" + f1 + "','" + f2 + "','" + f5 + "');", (err, value) => {
                if (err) {
                    throw (err);
                } else
                //response.render('login.html')
                    connection.query("INSERT INTO del_address(mobileno,house_no,street,area,pincode,landmark) VALUES ( " + f3 + " , '" + f6 + "','" + f7 + "','" + f8 + "','" + f9 + "','" + f10 + "');", (err, value) => {
                    if (err) {
                        throw (err);
                    } else
                    //response.render('login.html')
                        connection.query("INSERT INTO mem_status(mobileno,mem_status) VALUES ( " + f3 + " , '" + f11 + "');", (err, value) => {
                        if (err) {
                            throw (err);
                        } else
                            response.render('login.html')


                    })

                })

            })
    })


})


app.post('/cancel', function(request, response) {
    connection.query("INSERT INTO cancel1(ORDER_ID) values ( '" + (i - 1) + "');", (err, value) => {
        if (err) {
            throw (err);
        } else {
            response.render('cancel.html')
        }
    })
})


app.post('/feedback', function(request, response) {
    response.render('feedback.html')
})

app.post('/feedbackres', function(request, response) {
    var foodq = request.body.foodq;
    var delq = request.body.delq;
    var sugg = request.body.sugg;

    connection.query("INSERT INTO feedback(ORDER_ID,DEL_FEED,FOOD_FEED,SUGG) values ( '" + (i - 1) + "','" + foodq + "','" + delq + "','" + sugg + "');", (err, value) => {
        if (err) {
            throw (err);
        } else {
            response.render('login.html', {

            })
        }
    })
})


app.post('/promo', function(request, response) {
    connection.query("INSERT INTO promo(ORDER_ID) values ( '" + (i) + "');", (err, value) => {
        if (err) {
            throw (err);
        } else {
            // console.log(i);
            response.render('food.hbs', {
                message: 'PROMO CODE APPLIED successfully'
            })
        }
    })
})


app.post('/food', function(request, response) {

    var x = 0;

    let date_ob = new Date();
    var total_amt = 0;
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    //var f1 = request.body.f1;
    var f3 = request.body.f3;
    var f4 = request.body.f4;
    var f5 = request.body.f5;
    //console.log(mobileno);
    //console.log(f1);
    connection.query("SELECT CUS_FNAME,CUS_LNAME FROM cus_details WHERE MOB_NO = " + mobileno + " ", (err, value) => {
            if (err) {
                throw (err);
                return response.send('No such name');
            } else {
                // console.log(value[0]);
                // console.log("success");
                //var total_amt = 0;
                var CUS_FNAME = value[0].CUS_FNAME;
                var CUS_LNAME = value[0].CUS_LNAME;
            }

            //console.log(i);
            //console.log(CUS_FNAME);
            //console.log(CUS_LNAME);

            connection.query("INSERT INTO order_taken(ORDER_ID,CUS_FNAME,CUS_LNAME,STATUS_ID,ORDER_DATE,ORDER_TIME,TOT_AMT,mobileno) VALUES ( " + i + " , '" + CUS_FNAME + "','" + CUS_LNAME + "','PREP','" + year + "-" + month + "-" + date + "', '" + hours + ":" + minutes + ":" + seconds + "','1','" + mobileno + "' );",
                    (err, value) => {
                        if (err) {
                            throw (err);
                        } else {
                            //Biryani
                            f1 = request.body.f1;
                            if (f1 > 0)
                                connection.query("INSERT INTO order_details(ORDER_ID,ITEM_NAME,QTY) VALUES ( " + i + ",'Chicken Biryani'," + f1 + ");", (err, value) => {
                                    if (err) {
                                        throw (err);
                                    }
                                })
                            connection.query("SELECT PRICE FROM food_item WHERE ITEM_NAME='Chicken Biryani' ", (err, value) => {
                                if (err) {
                                    throw (err);
                                } else {
                                    //console.log(value[0].PRICE);
                                    //console.log(f1);
                                    var l = f1 * (value[0].PRICE);
                                    total_amt = l + total_amt;
                                    //console.log(total_amt);

                                }
                            })


                            //Parrota
                            f2 = request.body.f2;
                            if (f2 > 0)
                                connection.query("INSERT INTO order_details(ORDER_ID,ITEM_NAME,QTY) VALUES ( " + i + ",'Parotta'," + f2 + ");", (err, value) => {
                                    if (err) {
                                        throw (err);
                                    }
                                })
                            connection.query("SELECT PRICE FROM food_item WHERE ITEM_NAME='Parotta' ", (err, value) => {
                                if (err) {
                                    throw (err);
                                } else {
                                    //console.log(value[0].PRICE);
                                    // console.log(f2);
                                    var l = f2 * (value[0].PRICE);
                                    total_amt = l + total_amt;
                                    //console.log(total_amt);
                                }
                            })


                            //Chicken Gravy
                            f3 = request.body.f3;
                            if (f3 > 0)
                                connection.query("INSERT INTO order_details(ORDER_ID,ITEM_NAME,QTY) VALUES ( " + i + ",'Chicken Gravy'," + f3 + ");", (err, value) => {
                                    if (err) {
                                        throw (err);
                                    }
                                })
                            connection.query("SELECT PRICE FROM food_item WHERE ITEM_NAME='Chicken Gravy' ", (err, value) => {
                                if (err) {
                                    throw (err);
                                } else {
                                    //console.log(value[0].PRICE);
                                    // console.log(f3);
                                    var l = f3 * (value[0].PRICE);
                                    total_amt = l + total_amt;
                                    // console.log(total_amt);
                                }
                            })



                            //Panner Pulao
                            f4 = request.body.f4;
                            if (f4 > 0)
                                connection.query("INSERT INTO order_details(ORDER_ID,ITEM_NAME,QTY) VALUES ( " + i + ",'Panner Pulao'," + f4 + ");", (err, value) => {
                                    if (err) {
                                        throw (err);
                                    }
                                })
                            connection.query("SELECT PRICE FROM food_item WHERE ITEM_NAME='Panner Pulao' ", (err, value) => {
                                if (err) {
                                    throw (err);
                                } else {
                                    console.log(value[0].PRICE);
                                    // console.log(f4);
                                    var l = f4 * (value[0].PRICE);
                                    total_amt = l + total_amt;
                                    //console.log(total_amt);
                                }
                            })

                            //Brownies
                            f5 = request.body.f5;
                            if (f5 > 0)
                                connection.query("INSERT INTO order_details(ORDER_ID,ITEM_NAME,QTY) VALUES ( " + i + ",'Brownies'," + f5 + ");", (err, value) => {
                                    if (err) {
                                        throw (err);
                                    }
                                })
                            connection.query("SELECT PRICE FROM food_item WHERE ITEM_NAME='Brownies' ", (err, value) => {
                                if (err) {
                                    throw (err);
                                } else {
                                    //console.log(value[0].PRICE);
                                    // console.log(f5);
                                    var l = f5 * (value[0].PRICE);
                                    total_amt = l + total_amt;

                                    //console.log(total_amt);

                                }


                                //        var amount = connection.query("bill_amount(" + (i - 1) + ");", (err, value) => {
                                //            if (err) throw err
                                //       })
                                //      response.render('index.hbs', { Name: ' + CUS_FNAME + ' }, { Amount: ' + amount +' })

                                connection.query("UPDATE ORDER_TAKEN SET TOT_AMT = '" + total_amt + "' WHERE ORDER_ID=" + i + ";", (err, value) => {
                                    if (err) {
                                        throw (err);
                                    }
                                })

                                /* connection.query("INSERT INTO mem_avail(ORDER_ID) values ( '" + (i) + "');", (err, value) => {
                                     if (err) {
                                         throw (err);
                                     }
                                 })*/

                                connection.query("SELECT * FROM promo WHERE ORDER_ID=" + i + " ", (err, value) => {
                                    if (err) {
                                        throw (err);
                                    } else {

                                        if (value[0]) {
                                            //console.log(i);
                                            var amount = 0;


                                            //  console.log(i);
                                            connection.query("SELECT TOT_AMT FROM ORDER_TAKEN WHERE ORDER_ID=" + i + "", (err, value) => {
                                                // if (err) {
                                                //   throw (err);
                                                //}
                                                if (value[0]) {
                                                    total_amt = value[0];
                                                    console.log(total_amt);

                                                }

                                            })
                                            connection.query("call promo(" + (i - 1) + "," + total_amt + ");", (err, value) => {
                                                if (err) { throw err }

                                            })

                                            connection.query("INSERT INTO mem_avail(ORDER_ID) values ( '" + (i - 1) + "');", (err, value) => {
                                                if (err) {
                                                    throw (err);
                                                }

                                            })


                                            var amount;
                                            // console.log(i);
                                            connection.query("SELECT TOT_AMT FROM ORDER_TAKEN WHERE ORDER_ID = " + (i - 1) + ";", (err, value) => {
                                                if (err) { throw err } else {

                                                    amount = 1 * (value[0].TOT_AMT);
                                                    console.log(amount);
                                                    console.log(value[0].TOT_AMT);




                                                    response.render('index.hbs', { Name: CUS_FNAME, Amount: amount })

                                                }
                                            })
                                        }

                                        if (!value[0]) {





                                            connection.query("INSERT INTO mem_avail(ORDER_ID) values ( '" + (i - 1) + "');", (err, value) => {
                                                if (err) {
                                                    throw (err);
                                                }

                                            })

                                            var amount;
                                            //console.log(i);
                                            connection.query("SELECT TOT_AMT FROM ORDER_TAKEN WHERE ORDER_ID = " + (i - 1) + ";", (err, value) => {
                                                if (err) { throw err } else {

                                                    amount = 1 * (value[0].TOT_AMT);
                                                    console.log(amount);
                                                    console.log(value[0].TOT_AMT);

                                                }


                                                response.render('index.hbs', { Name: CUS_FNAME, Amount: amount })

                                            })
                                        }
                                    }
                                })



                                i += 1;
                                // console.log(total_amt);

                            })
                        }

                        //console.log(total_amt);


                        // console.log(total_amt);
                    })
                //console.log(total_amt);
        })
        //console.log(total_amt);
})



app.listen(4000, () => {
    console.log('Server is turned on 4000')
});