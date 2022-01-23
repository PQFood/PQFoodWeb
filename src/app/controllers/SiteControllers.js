
class SiteController {
    
    async index(req, res, next) {
        res.render('home')
    }

   async test(req,res,next){
       res.render('test')
   }

}

module.exports = new SiteController();
