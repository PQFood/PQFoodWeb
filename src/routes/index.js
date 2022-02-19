const siteRouter = require('./site');
const adminRouter = require('./admin');
const authAdmin = require('../util/validateAdmin')

function route(app) {

  
    app.use('/',siteRouter);
    app.use('/admin',authAdmin.requireAuth,adminRouter);

}

module.exports = route;
