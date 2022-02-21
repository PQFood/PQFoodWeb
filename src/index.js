const express = require('express')
const app = express()
const path = require('path');
const morgan = require('morgan');



//tra ve log http
app.use(morgan('combined'))

//notification
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser('secret'));

app.use(session({
        secret : 'something',
        resave :true,
        saveUninitialized: true,
        cookie : {maxAge:null}      
    }));
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
  })

//body-parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

//template engine
const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

app.engine(
  'hbs',
  handlebars({
      extname: '.hbs',
      helpers: {
          sum: function(a,b) {return a+b;},
          equals: function(a,b) {return a==b;},
      }
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//set public
app.use(express.static(path.join(__dirname, 'public/')));

console.log(path.join(__dirname, 'public/'))
// // set view 
app.set('view options', { layout: 'admin' });
// app.set('view options', { layout: 'admin' });
// app.set('view options', { layout: 'staff' });


//database
const db = require('./config/db')
db.connect()

//xac dinh tuyen duong
const route = require('./routes');
route(app);




app.listen(process.env.PORT || 8080)








// //database
// const db = require('./config/db')
// db.connect()



// //set public
// app.use(express.static(path.join(__dirname, 'public/')));


//
//xac dinh tuyen duong
// const route = require('./routes');
// route(app);

// app.listen(process.env.PORT || 8080);

