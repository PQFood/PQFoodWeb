const admin = require('../models/admin');


class SiteController {
    
    async index(req, res, next) {
        res.render(
            'homeAdmin',{
            layout: 'admin'
        })
    }

    async addFood(req, res, next){
        res.render(
            'addFood',{
            layout: 'admin'
        })
    }

    async test(req, res, next){
        res.render(
            'addFood',{
            layout: 'admin'
        })
    }

}

module.exports = new SiteController();
