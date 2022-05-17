const admin = require('../models/admin');
const cloudinary = require('cloudinary').v2
const foodMenu = require('../models/foodMenu');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const sha256 = require('sha256');
const staff = require('../models/staff');
const dinnerTable = require('../models/dinnerTable');
const warehouse = require('../models/warehouse');
const order = require('../models/order');
const orderHistory = require('../models/orderHistory');
const shipHistory = require('../models/shipHistory');
const bookShip = require('../models/bookShip');
const moment = require('moment')
const { io } = require("socket.io-client");
const urlSocketIO = "http://192.168.1.20:8002"



class AdminController {

    async index(req, res, next) {
        try {
            var menuFoods = await foodMenu.find({ classify: 1 })
            var menuFoodLimit = await foodMenu.find({ classify: 1 }).limit(8)
            var menuDrinks = await foodMenu.find({ classify: 2 })
            res.render(
                'homeAdmin', {
                layout: 'admin',
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

    async logout(req, res, next) {
        try {
            res.clearCookie("adminId")
            res.redirect('/')
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async submitAddForm(req, res, next) {
        try {
            const foodNew = new foodMenu(req.body)
            await cloudinary.uploader.upload(req.files.image.tempFilePath,
                {
                    folder: 'pqfood',
                    use_filename: true
                },
                function (error, result) {
                    foodNew.image = result.url
                });
            foodNew.name = req.body.nameFood
            var resultUpload = await foodNew.save()
            if (resultUpload) {
                req.session.message = {
                    type: 'success',
                    intro: 'Thêm thực đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Thêm thực đơn thất bại',
                    message: ''
                }
            }

            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Thêm thực đơn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async menu(req, res, next) {
        try {
            var menuFoods = await foodMenu.find({ classify: 1 })
            var menuDinks = await foodMenu.find({ classify: 2 })
            var menuDeleted = await foodMenu.findDeleted({})
            res.render(
                'menuAdmin', {
                layout: 'admin',
                menuFoods: mutipleMongooseToObject(menuFoods),
                menuDinks: mutipleMongooseToObject(menuDinks),
                menuDeleted: mutipleMongooseToObject(menuDeleted),

            })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async editFood(req, res, next) {
        try {
            var slug = req.params.slug
            var food = await foodMenu.findOne({ slug: slug })
            res.render(
                'editFood', {
                layout: 'admin',
                food: MongooseToObject(food)
            })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async submitEditFood(req, res, next) {
        try {
            var slug = req.params.slug
            var result
            if (req.files) {
                var linkImg
                await cloudinary.uploader.upload(req.files.image.tempFilePath,
                    {
                        folder: 'pqfood',
                        use_filename: true
                    },
                    function (error, result) {
                        linkImg = result.url
                    });

                result = await foodMenu.updateOne({ slug: slug }, {
                    name: req.body.nameFood,
                    price: req.body.price,
                    image: linkImg,
                    classify: req.body.classify,
                    description: req.body.description,
                })
            }
            else {
                result = await foodMenu.updateOne({ slug: slug }, {
                    name: req.body.nameFood,
                    price: req.body.price,
                    classify: req.body.classify,
                    description: req.body.description,
                })
            }
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Cập nhật thực đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Cập nhật thực đơn thất bại',
                    message: ''
                }
            }

            res.redirect("/admin/menu")
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Cập nhật thực đơn thất bại',
                message: ''
            }
            res.redirect("/admin/menu")
            console.log(err)
        }
    }

    async deleteFood(req, res, next) {
        try {
            var slug = await req.params.slug
            var result = await foodMenu.delete({ slug: slug })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa thực đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa thực đơn thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa thực đơn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async restoreFood(req, res, next) {
        try {
            var slug = await req.params.slug
            var result = await foodMenu.restore({ slug: slug })
            res.redirect('/admin/editFood/' + slug)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async destroyFood(req, res, next) {
        try {
            var slug = await req.params.slug
            var result = await foodMenu.deleteOne({ slug: slug })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa thực đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa thực đơn thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa thực đơn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async staff(req, res, next) {
        try {
            var infoStaffFind = await staff.find({})
            res.render('staffAdmin',
                {
                    layout: 'admin',
                    infoStaffFind: mutipleMongooseToObject(infoStaffFind),
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async checkExists(req, res, next) {
        try {
            var data = await staff.findOne({ userName: req.body.userName })
            var data2 = await admin.findOne({ userName: req.body.userName })
            if (data != null || data2 != null) res.send(false)
            else res.send(true)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async submitAddStaff(req, res, next) {
        try {
            var pass = sha256(req.body.password)
            const staffNew = new staff(req.body)
            staffNew.password = pass
            var resultUploadStaff = await staffNew.save()
            if (resultUploadStaff) {
                req.session.message = {
                    type: 'success',
                    intro: 'Thêm nhân viên thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Thêm nhân viên thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Thêm nhân viên thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async editStaff(req, res, next) {
        try {
            var slug = req.params.slug
            var infoStaffFind = await staff.findOne({ userName: slug })
            res.render('editStaff',
                {
                    layout: 'admin',
                    infoStaffFind: MongooseToObject(infoStaffFind),
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async deleteStaff(req, res, next) {
        try {
            var slug = req.params.slug
            var resultStaff = await staff.deleteOne({ userName: slug })
            if (resultStaff) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa nhân viên thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa nhân viên thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa nhân viên thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async submitEditStaff(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await staff.updateOne({ userName: slug }, {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                position: req.body.position,
                address: req.body.address,
            })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Cập nhật thông tin nhân viên thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Cập nhật thông tin nhân viên thất bại',
                    message: ''
                }
            }
            res.redirect('/admin/staff')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Cập nhật thông tin nhân viên thất bại',
                message: ''
            }
            res.redirect('/admin/staff')
            console.log(err)
        }
    }

    async dinnerTable(req, res, next) {
        try {
            var table = await dinnerTable.find({})
            res.render('dinnerTable',
                {
                    layout: 'admin',
                    table: mutipleMongooseToObject(table),
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async submitAddDinnerTable(req, res, next) {
        try {
            const tableNew = new dinnerTable(req.body)
            var result = await tableNew.save()
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Thêm bàn ăn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Thêm bàn ăn thất bại',
                    message: ''
                }
            }
            res.redirect("/admin/dinnerTable")
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Thêm bàn ăn thất bại',
                message: ''
            }
            res.redirect("/admin/dinnerTable")
            console.log(err)
        }
    }

    async editDinnerTable(req, res, next) {
        try {
            var slug = req.params.slug
            var tableFind = await dinnerTable.findOne({ slug: slug })
            res.render('editDinnerTable',
                {
                    layout: 'admin',
                    tableFind: MongooseToObject(tableFind),
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async deleteDinnerTable(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await dinnerTable.deleteOne({ slug: slug })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa bàn ăn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa bàn ăn thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa bàn ăn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }
    async submitEditDinnerTable(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await dinnerTable.updateOne({ slug: slug }, {
                name: req.body.name,
                description: req.body.description,
                quantity: req.body.quantity,
            })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Cập nhật thông tin bàn ăn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Cập nhật thông tin bàn ăn thất bại',
                    message: ''
                }
            }
            res.redirect('/admin/dinnerTable')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Cập nhật thông tin bàn ăn thất bại',
                message: ''
            }
            res.redirect('/admin/dinnerTable')
            console.log(err)
        }
    }

    async changePassword(req, res, next) {
        res.render('changePassword',
            {
                layout: 'admin',
            })
    }
    async checkEqualPassword(req, res, next) {
        try {
            var passOld = sha256(req.body.passOld)
            var data = await admin.findOne({ _id: req.signedCookies.adminId, password: passOld })
            if (data == null) {
                res.send(false)
            }
            else {
                res.send(true)
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async submitChangePassword(req, res, next) {
        try {
            var passNew = sha256(req.body.passNew)
            var data = await admin.updateOne({ _id: req.signedCookies.adminId }, {
                password: passNew
            })
            res.clearCookie("adminId")
            res.redirect('/admin')
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async warehouse(req, res, next) {
        try {
            var items = await warehouse.find({})
            var itemDeleted = await warehouse.findDeleted({})
            res.render('warehouseAdmin',
                {
                    layout: 'admin',
                    items: mutipleMongooseToObject(items),
                    itemDeleted: mutipleMongooseToObject(itemDeleted),
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async submitAddItem(req, res, next) {
        try {
            const warehouseNew = new warehouse(req.body);
            var result = await warehouseNew.save()
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Thêm sản phẩm thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Thêm sản phẩm thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Thêm sản phẩm thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async editItem(req, res, next) {
        try {
            var slug = req.params.slug
            var item = await warehouse.findOne({ slug: slug })
            res.render('editItem',
                {
                    layout: 'admin',
                    item: MongooseToObject(item)
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }
    async submitEditItem(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await warehouse.updateOne({ slug: slug }, {
                name: req.body.name,
                unit: req.body.unit,
                quantity: req.body.quantity,
                providerName: req.body.providerName,
                providerPhoneNumber: req.body.providerPhoneNumber,
                providerAddress: req.body.providerAddress,
            })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Cập nhật sản phẩm thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Cập nhật sản phẩm thất bại',
                    message: ''
                }
            }
            res.redirect('/admin/warehouse')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Cập nhật sản phẩm thất bại',
                message: ''
            }
            res.redirect('/admin/warehouse')
            console.log(err)
        }
    }
    async deleteItem(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await warehouse.delete({ slug: slug })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa sản phẩm thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa sản phẩm thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa sản phẩm thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async restoreItem(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await warehouse.restore({ slug: slug })
            res.redirect('/admin/editItem/' + slug)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async destroyItem(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await warehouse.deleteOne({ slug: slug })
            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa sản phẩm thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa sản phẩm thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa sản phẩm thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async revenue(req, res, next) {
        try {
            //day
            var timeRevenue = req.query.timeInput
            var today
            if (timeRevenue) {
                today = moment(timeRevenue, 'DD-MM-YYYY').startOf('day')
            }
            else today = moment().startOf('day')
            var data = await orderHistory.find({
                updatedAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate()
                },
                state: "Đã thanh toán"
            })
            var total = 0
            for (var i = 0; i < data.length; i++) {
                total = total + data[i].total
            }

            var dataShip = await shipHistory.find({
                updatedAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate()
                },
                state: "Đã hoàn thành"
            })

            for (var i = 0; i < dataShip.length; i++) {
                total = total + dataShip[i].total
            }

            //week
            var todayWeek = moment().startOf('day')

            var arrDay = []
            var dem = 0

            for (var i = todayWeek.isoWeekday() - 1; i > 0; i--) {
                var temp = moment(todayWeek)
                arrDay[dem] = temp.subtract(i, 'days')
                dem++
            }

            arrDay[dem] = todayWeek
            dem++

            for (var i = 1; i <= 7 - todayWeek.isoWeekday(); i++) {
                var temp = moment(todayWeek)
                arrDay[dem] = temp.add(i, 'days')
                dem++
            }

            var arrTotal = []
            var totalWeek = 0
            for (var i = 0; i < 7; i++) {
                var dayFind = arrDay[i]
                var data = await orderHistory.find({
                    updatedAt: {
                        $gte: dayFind.startOf('day').toDate(),
                        $lte: moment(dayFind).endOf('day').toDate()
                    },
                    state: "Đã thanh toán"
                })

                var totalTempWeek = 0

                for (var j = 0; j < data.length; j++) {
                    totalTempWeek = totalTempWeek + data[j].total
                }

                var dataShip = await shipHistory.find({
                    updatedAt: {
                        $gte: dayFind.startOf('day').toDate(),
                        $lte: moment(dayFind).endOf('day').toDate()
                    },
                    state: "Đã hoàn thành"
                })

                for (var j = 0; j < dataShip.length; j++) {
                    totalTempWeek = totalTempWeek + dataShip[j].total
                }
                totalWeek = totalWeek + totalTempWeek
                arrTotal[i] = totalTempWeek
            }

            for(var i = 0;i<7;i++){
                arrDay[i] = arrDay[i].format('DD/MM/YYYY');
            }

            //year
            var date = new Date()
            var year = date.getFullYear()
            var arr = []
            for (var i = 1; i <= 12; i++) {
                var currentDate = moment(year + '-' + i,'YYYY-MM')
                var orders = await orderHistory.find({
                    updatedAt: {
                        $gte: currentDate.startOf('month').toDate(),
                        $lte: moment(currentDate).endOf('month').toDate()
                    },
                    state: "Đã thanh toán"
                })
                var temp = 0
                for (var j = 0; j < orders.length; j++) {
                    temp = temp + orders[j].total
                }

                var ships = await shipHistory.find({
                    updatedAt: {
                        $gte: currentDate.toDate(),
                        $lte: moment(currentDate).endOf('month').toDate()
                    },
                    state: "Đã hoàn thành"
                })
                for (var j = 0; j < ships.length; j++) {
                    temp = temp + ships[j].total
                }

                arr[i - 1] = temp
            }

            res.render('revenueAdmin',
                {
                    layout: 'admin',
                    total: total,
                    arr: arr,
                    totalWeek : totalWeek,
                    arrTotalWeek: arrTotal,
                    arrDay: arrDay,
                    today: today.format("DD/MM/YYYY")
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }

    async encash(req, res, next) {
        try {
            var histories = await orderHistory.find({ state: ["Đã hủy", "Đã thanh toán"] }).sort({ updatedAt: -1 }).limit(50)
            var waitConfirm = await orderHistory.find({ state: "Chờ xác nhận" }).sort({ updatedAt: 1 })
            var waitPayment = await order.find({}).sort({ updatedAt: 1 })
            var currentShip = await bookShip.find({}).sort({ updatedAt: 1 })
            var waitPaymentShip = await shipHistory.find({ state: "Chờ xác nhận" }).sort({ updatedAt: 1 })
            var historiesShip = await shipHistory.find({ state: ["Đã hủy", "Đã hoàn thành"] }).sort({ updatedAt: -1 }).limit(50)

            res.render('encash',
                {
                    layout: 'admin',
                    histories: mutipleMongooseToObject(histories),
                    waitConfirm: mutipleMongooseToObject(waitConfirm),
                    waitPayment: mutipleMongooseToObject(waitPayment),
                    waitPaymentShip: mutipleMongooseToObject(waitPaymentShip),
                    historiesShip: mutipleMongooseToObject(historiesShip),
                    currentShip: mutipleMongooseToObject(currentShip),
                })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async getData(req, res, next) {
        try {
            var year
            if (req.query.year) {
                year = req.query.year
            }
            else {
                year = date.getFullYear()
            }
            var arr = []
            for (var i = 1; i <= 12; i++) {
                var currentDate = moment(year + '-' + i,'YYYY-MM')
                var orders = await orderHistory.find({
                    updatedAt: {
                        $gte: currentDate.toDate(),
                        $lte: moment(currentDate).endOf('month').toDate()
                    },
                    state: "Đã thanh toán"
                })
                var total = 0
                for (var j = 0; j < orders.length; j++) {
                    total = total + orders[j].total
                }

                var ships = await shipHistory.find({
                    updatedAt: {
                        $gte: currentDate.toDate(),
                        $lte: moment(currentDate).endOf('month').toDate()
                    },
                    state: "Đã hoàn thành"
                })
                for (var j = 0; j < ships.length; j++) {
                    total = total + ships[j].total
                }

                arr[i - 1] = total

            }
            res.json(arr)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async paymentConfirm(req, res, next) {
        try {
            var slug = req.params.slug
            var result = await orderHistory.updateOne({ orderId: slug }, {
                state: "Đã thanh toán"
            })

            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xác nhận thanh toán thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xác nhận thanh toán thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        } catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xác nhận thanh toán thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async deleteOrder(req, res, next) {
        try {
            var slug = req.params.slug
            var orderFind = await order.findOne({ orderId: slug })
            var orderHistoryNew = {}
            var socket = io(urlSocketIO);
            orderHistoryNew.dinnerTable = orderFind.dinnerTable
            orderHistoryNew.dinnerTableName = orderFind.dinnerTableName
            orderHistoryNew.orderId = orderFind.orderId
            orderHistoryNew.note = orderFind.note
            orderHistoryNew.order = orderFind.order
            orderHistoryNew.total = orderFind.total
            orderHistoryNew.state = "Đã hủy"
            orderHistoryNew.reason = "Chủ quán hủy"
            orderHistoryNew.staff = orderFind.staff
            orderHistoryNew = new orderHistory(orderHistoryNew)
            var resultInsert = await orderHistoryNew.save()
            var resultDelete = await order.deleteOne({ orderId: slug })
            if (resultInsert && resultDelete) {
                socket.emit("sendNotificationWaiterUpdate", {
                    senderName: "Chủ quán",
                    table: orderFind.dinnerTableName,
                    act: 2
                })
                socket.emit('forceDisconnect');
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa hóa đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa hóa đơn thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa hóa đơn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async paymentConfirmShip(req, res, next) {
        try {
            var slug = req.params.slug;

            var result = await shipHistory.updateOne({ orderId: slug }, {
                state: "Đã hoàn thành"
            })

            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xác nhận thanh toán thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xác nhận thanh toán thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xác nhận thanh toán thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async weeklyRevenue(req, res, next) {
        try {
            var daySend = req.query.daySend
            var today
            if(daySend) today = moment(daySend, 'DD-MM-YYYY')
            else today = moment()

            var arrDay = []
            var dem = 0

            for (var i = today.isoWeekday() - 1; i > 0; i--) {
                var temp = moment(today)
                arrDay[dem] = temp.subtract(i, 'days')
                dem++
            }

            arrDay[dem] = today
            dem++

            for (var i = 1; i <= 7 - today.isoWeekday(); i++) {
                var temp = moment(today)
                arrDay[dem] = temp.add(i, 'days')
                dem++
            }

            var arrTotal = []
            var totalWeek = 0
            for (var i = 0; i < 7; i++) {
                var dayFind = arrDay[i]
                var data = await orderHistory.find({
                    updatedAt: {
                        $gte: dayFind.startOf('day').toDate(),
                        $lte: moment(dayFind).endOf('day').toDate()
                    },
                    state: "Đã thanh toán"
                })

                var total = 0

                for (var j = 0; j < data.length; j++) {
                    total = total + data[j].total
                }

                var dataShip = await shipHistory.find({
                    updatedAt: {
                        $gte: dayFind.startOf('day').toDate(),
                        $lte: moment(dayFind).endOf('day').toDate()
                    },
                    state: "Đã hoàn thành"
                })

                for (var j = 0; j < dataShip.length; j++) {
                    total = total + dataShip[j].total
                }
                totalWeek = totalWeek + total
                arrTotal[i] = total
            }

            for(var i = 0;i<7;i++){
                arrDay[i] = arrDay[i].format('DD/MM/YYYY');
            }

            res.json({
                arrDay: arrDay,
                arrTotal: arrTotal,
                totalWeek: totalWeek
            })
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'lỗi tải trang!',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async deleteCurrentShip(req, res, next) {
        try {
            var orderId = req.params.slug
            var bookShipFind = await bookShip.findOne({ orderId: orderId })
            var socket = io(urlSocketIO);
            var bookShipHistoryNew = {}
            bookShipHistoryNew.orderId = bookShipFind.orderId
            bookShipHistoryNew.note = bookShipFind.note
            bookShipHistoryNew.order = bookShipFind.order
            bookShipHistoryNew.total = bookShipFind.total
            bookShipHistoryNew.state = "Đã hủy"
            bookShipHistoryNew.staff = bookShipFind.staff
            bookShipHistoryNew.phoneNumber = bookShipFind.phoneNumber
            bookShipHistoryNew.name = bookShipFind.name
            bookShipHistoryNew.address = bookShipFind.address
            bookShipHistoryNew.reason = "Chủ quán hủy"

            bookShipHistoryNew = new shipHistory(bookShipHistoryNew)
            var resultDelete = await bookShip.deleteOne({ orderId: orderId })
            var resultInsert = await bookShipHistoryNew.save()

            if (resultInsert && resultDelete) {
                socket.emit("sendNotificationAdminCancelShip", {
                    orderId: orderId,
                  })
                socket.emit('forceDisconnect');
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa hóa đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa hóa đơn thất bại',
                    message: ''
                }
            }
            res.redirect('back')
        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa hóa đơn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }
    async deleteOrderPay(req,res,next){
        try{
            var result = await orderHistory.updateOne({ orderId: req.params.slug }, {
                state: "Đã hủy",
                reason: "Chủ quán hủy"
            })

            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa hóa đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa hóa đơn thất bại',
                    message: ''
                }
            }
            res.redirect('back')

        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa hóa đơn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    async deleteShipPay(req,res,next){
        try{
            var result = await shipHistory.updateOne({ orderId: req.params.slug }, {
                state: "Đã hủy",
                reason: "Chủ quán hủy"
            })

            if (result) {
                req.session.message = {
                    type: 'success',
                    intro: 'Xóa hóa đơn thành công!',
                    message: ''
                }
            }
            else {
                req.session.message = {
                    type: 'warning',
                    intro: 'Xóa hóa đơn thất bại',
                    message: ''
                }
            }
            res.redirect('back')

        }
        catch (err) {
            req.session.message = {
                type: 'warning',
                intro: 'Xóa hóa đơn thất bại',
                message: ''
            }
            res.redirect('back')
            console.log(err)
        }
    }

    


}

module.exports = new AdminController();
