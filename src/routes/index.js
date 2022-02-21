const siteRouter = require('./site');
const adminRouter = require('./admin');
const authAdmin = require('../util/validateAdmin')

function route(app) {

    app.use('/admin',authAdmin.requireAuth,adminRouter);
    app.use('/',siteRouter);
}

module.exports = route;
