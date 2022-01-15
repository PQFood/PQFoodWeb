const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




// const path = require('path');
// const express = require('express');
// const app = express();
// const morgan = require('morgan');
// const handlebars = require('express-handlebars');



// //database
// const db = require('./config/db')
// db.connect()

// app.use(morgan('combined'));
// //template engine
// app.engine('handlebars', handlebars());
// app.set('view engine', 'handlebars');
// app.engine(
//     'hbs',
//     handlebars({
//         extname: '.hbs',
//         helpers: {
//             sum: function(a,b) {return a+b;},
//             equals: function(a,b) {return a==b;},
//         }
//     }),
// );

// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'resources/views'));

// //set public
// app.use(express.static(path.join(__dirname, 'public/')));


//
//xac dinh tuyen duong
// const route = require('./routes');
// route(app);

// app.listen(process.env.PORT || 8080);

