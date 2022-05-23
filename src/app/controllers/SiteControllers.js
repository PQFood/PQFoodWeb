const admin = require('../models/admin');
const bookTable = require('../models/bookTable');
const bookShip = require('../models/bookShip');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const foodMenu = require('../models/foodMenu');
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 15 });
const sha256 = require('sha256');
const moment = require('moment')
const { io } = require("socket.io-client");
const urlSocketIO = "http://192.168.175.23:8002"

class SiteController {

    async index(req, res, next) {
        try {
            var menuFoods = await foodMenu.find({ classify: 1 })
            var menuFoodLimit = await foodMenu.find({ classify: 1 }).limit(8)
            var menuDrinks = await foodMenu.find({ classify: 2 })

            res.render('home', {
                menuFoods: mutipleMongooseToObject(menuFoods),
                menuFoodLimit: mutipleMongooseToObject(menuFoodLimit),
                menuDrinks: mutipleMongooseToObject(menuDrinks),

            })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async test(req, res, next) {
        // const socket = io("http://192.168.1.8:5000");
        res.render("test")
    }

    async login(req, res, next) {
        try {
            var pass = sha256(req.body.passwordLogin)

            var data = await admin.findOne({ userName: req.body.userLogin, password: pass })
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
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Đăng nhập thất bại!',
                message: 'Vui lòng đăng nhập lại!',
                show: 'show ne'
            }
            res.redirect('back')
            console.log(err)
        }
    }



    async booktable(req, res, next) {
        try {
            const socket = io(urlSocketIO);
            const bookTableNew = new bookTable(req.body)
            bookTableNew.state = "Đang xử lý"
            var resultUpload = await bookTableNew.save()
            if (resultUpload) {
                socket.emit("sendNotificationBookTable")
                socket.emit('forceDisconnect');
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
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Đặt bàn thất bại!',
                message: 'Vui lòng thực hiện lại!'
            }
            res.redirect('/')
            console.log(err)
        }

    }

    async bookShip(req, res, next) {
        try {
            var menu = await foodMenu.find({})
            res.render('bookShip', {
                menu: mutipleMongooseToObject(menu)
            })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async submitBookShip(req, res, next) {
        try {
            const socket = io(urlSocketIO);
            var temp = await req.body;
            var bookShipNew = new bookShip();
            bookShipNew.name = temp.name;
            bookShipNew.phoneNumber = temp.phoneNumber;
            bookShipNew.address = temp.address;
            bookShipNew.note = temp.note;
            bookShipNew.orderId = uid();
            bookShipNew.total = temp.total;
            bookShipNew.state = "Chờ xác nhận";

            for (var i = 0; i < temp.order.ds.length; i++) {
                var food = await foodMenu.findOne({ slug: temp.order.ds[i] })
                var orderTemp = {}
                orderTemp.name = food.name
                orderTemp.price = food.price
                orderTemp.classify = food.classify
                orderTemp.description = food.description
                orderTemp.image = food.image
                orderTemp.slug = food.slug
                orderTemp.quantity = temp.order[temp.order.ds[i]].sl
                bookShipNew.order[i] = orderTemp;
            }

            var resultUpload = await bookShipNew.save()
            if (resultUpload) {
                socket.emit("sendNotificationBookShip")
                socket.emit('forceDisconnect');
                req.session.message = {
                    type: 'success',
                    intro: 'Đặt giao đồ ăn thành công!',
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
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Đặt đồ ăn thất bại!',
                message: 'Vui lòng thực hiện lại!'
            }
            res.redirect('/')
            console.log(err)
        }


    }

    async search(req, res, next) {
        try {
            var timeBook = req.query.timeInput
            var bookTableFind
            if (timeBook) {
                var today = moment(timeBook, 'DD-MM-YYYY').startOf('day')
                bookTableFind = await bookTable.find({
                    time: {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                })
            }
            else {
                bookTableFind = await bookTable.find({}).sort({ updatedAt: -1 }).limit(6)
            }

            var bookShipFind = await bookShip.find({})
            for (var i = 0; i < bookTableFind.length; i++) {
                bookTableFind[i]._doc.time = moment(bookTableFind[i].time).format("LT,DD/MM/YYYY")
            }
            res.render('search', {
                bookShipFind: mutipleMongooseToObject(bookShipFind),
                bookTableFind: mutipleMongooseToObject(bookTableFind),

            })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

}

module.exports = new SiteController();
