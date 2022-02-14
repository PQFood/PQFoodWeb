const chuquan = require('../models/chuquan');


class SiteController {
    
    async index(req, res, next) {
        res.render('home')
    }

   async test(req,res,next){
    var hienthi = await chuquan.find({})
    res.json(hienthi)
   }


}

module.exports = new SiteController();
