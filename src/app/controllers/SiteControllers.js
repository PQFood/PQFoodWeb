const admin = require('../models/admin');
const bookTable = require('../models/bookTable');
const bookShip = require('../models/bookShip');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const foodMenu = require('../models/foodMenu');

const sha256 = require('sha256');

class SiteController {

    async index(req, res, next) {
        var menuFoods = await foodMenu.find({classify : 1})
        var menuFoodLimit = await foodMenu.find({classify : 1}).limit(8)
        var menuDrinks = await foodMenu.find({classify : 2})


        res.render('home',{
            menuFoods: mutipleMongooseToObject(menuFoods),
            menuFoodLimit: mutipleMongooseToObject(menuFoodLimit),
            menuDrinks: mutipleMongooseToObject(menuDrinks),
            
        })
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
                message: 'Vui lòng đăng nhập lại!',
                show: 'show ne'
            }
            res.redirect('back')
        }
    }


    async bookShip(req, res, next) {
        const bookShipNew = new bookShip(req.body)
        bookShipNew.state = "Đang xử lý"
        var resultUpload = await bookShipNew.save()
        if (resultUpload) {
            req.session.message = {
                type: 'success',
                intro: 'Đặt giao đô ăn thành công!',
                message: 'Cảm ơn bạn đã đặt đồ ăn bên chúng tôi!'
            }
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Đặt đồ ăn thất bại!',
                message: 'Vui lòng thực hiện lại!'
            }
        }
        res.redirect('/')
    }

    async booktable(req, res, next) {
        const bookTableNew = new bookTable(req.body)
        bookTableNew.state = "Đang xử lý"
        var resultUpload = await bookTableNew.save()
        if (resultUpload) {
            req.session.message = {
                type: 'success',
                intro: 'Đặt bàn thành công!',
                message: 'Cảm ơn bạn đã đặt bàn với chúng tôi!'
            }
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Đặt bàn thất bại!',
                message: 'Vui lòng thực hiện lại!'
            }
        }
        res.redirect('/')
    }

}

module.exports = new SiteController();
