const admin = require('../models/admin');
const sha256 = require('sha256');

class SiteController {

    async index(req, res, next) {
        res.render('home')
    }

    async test(req, res, next) {
        var hienthi = await chuquan.find({})
        res.json(hienthi)
    }

    async login(req, res, next) {
        var pass = sha256(req.body.passwordLogin)

        var data = await admin.findOne({ username: req.body.userLogin, password: pass })
        if (data != null) {
            req.session.message = {
                type: 'success',
                intro: 'Chúc mừng bạn đăng nhập thành công!',
                message: ''
            }
            res.cookie('adminId', data.id, {
                signed: true,
                maxAge: 1000 * 60 * 60 * 2
            })
            res.redirect('/admin')
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Đăng nhập thất bại!',
                message: 'Vui lòng đăng nhập lại!'
            }
            res.redirect('back')
        }
    }

    async test(req, res, next){
        res.render(
            'addFood',{
            layout: 'admin'
        })
    }

}

module.exports = new SiteController();
