const express = require('express')
const app = express()
const path = require('path');
const morgan = require('morgan');



//tra ve log http
app.use(morgan('combined'))


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

// // set view 
// app.set('view options', { layout: 'customer' });
// app.set('view options', { layout: 'admin' });
// app.set('view options', { layout: 'staff' });

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

