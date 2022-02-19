const admin = require('../models/admin');


class SiteController {
    
    async index(req, res, next) {
        res.render(
            'home',{
            layout: 'admin'
        })
    }



}

module.exports = new SiteController();
