const admin = require('../models/admin');
const cloudinary = require('cloudinary').v2
const foodMenu = require('../models/foodMenu');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const sha256 = require('sha256');
const staff = require('../models/staff');
const infoStaff = require('../models/infoStaff');
const dinnerTable = require('../models/dinnerTable');



class SiteController {

    async index(req, res, next) {
        var menuFoods = await foodMenu.find({classify : 1})
        var menuFoodLimit = await foodMenu.find({classify : 1}).limit(8)
        var menuDrinks = await foodMenu.find({classify : 2})
        res.render(
            'homeAdmin', {
            layout: 'admin',
            menuFoods: mutipleMongooseToObject(menuFoods),
            menuFoodLimit: mutipleMongooseToObject(menuFoodLimit),
            menuDrinks: mutipleMongooseToObject(menuDrinks),
        })
    }

    async logout(req, res, next) {
        res.clearCookie("adminId")
        res.redirect('/')
    }

    async submitAddForm(req, res, next) {
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

    async menu(req, res, next) {
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

    async editFood(req, res, next) {
        var slug = req.params.slug
        var food = await foodMenu.findOne({ slug: slug })
        res.render(
            'editFood', {
            layout: 'admin',
            food: MongooseToObject(food)
        }
        )
        // res.json(food)
    }

    async submitEditFood(req, res, next) {
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

    async deleteFood(req, res, next) {
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

    async restoreFood(req, res, next) {
        var slug = await req.params.slug
        var result = await foodMenu.restore({ slug: slug })
        res.redirect('/admin/editFood/' + slug)
    }

    async destroyFood(req, res, next) {
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

    async staff(req, res, next) {
        var infoStaffFind = await infoStaff.find({})
        res.render('staffAdmin',
            {
                layout: 'admin',
                infoStaffFind: mutipleMongooseToObject(infoStaffFind),
            })
    }

    async checkExists(req, res, next) {
        var data = await staff.findOne({ userName: req.body.userName })
        if (data != null) res.send(false)
        else res.send(true)
    }

    async submitAddStaff(req, res, next) {
        var pass = sha256(req.body.password)
        const staffNew = new staff(req.body)
        staffNew.password = pass
        const infoStaffNew = new infoStaff(req.body)

        // res.json(staffNew + infoStaffNew)
        //add
        var resultUploadStaff = await staffNew.save()
        var resultUploadÌnoStaff = await infoStaffNew.save()
        if (resultUploadStaff && resultUploadÌnoStaff) {
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

    async editStaff(req, res, next) {
        var slug = req.params.slug
        var infoStaffFind = await infoStaff.findOne({ userName: slug })
        res.render('editStaff',
            {
                layout: 'admin',
                infoStaffFind: MongooseToObject(infoStaffFind),
            })
    }
    async deleteStaff(req, res, next) {
        var slug = req.params.slug
        var resultStaff = await staff.deleteOne({ userName: slug })
        var resultInfoStaff = await infoStaff.deleteOne({ userName: slug })
        if (resultStaff && resultInfoStaff) {
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

    async submitEditStaff(req, res, next) {
        var slug = req.params.slug
        var result = await infoStaff.updateOne({ userName: slug }, {
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

    async dinnerTable(req,res,next){
        var table = await dinnerTable.find({})
        res.render('dinnerTable',
        {
            layout: 'admin',
            table: mutipleMongooseToObject(table),
        })
    }

    async submitAddDinnerTable(req,res,next){
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

    async editDinnerTable(req, res, next) {
        var slug = req.params.slug
        var tableFind = await dinnerTable.findOne({ slug: slug })
        res.render('editDinnerTable',
            {
                layout: 'admin',
                tableFind: MongooseToObject(tableFind),
            })
    }
    async deleteDinnerTable(req, res, next) {
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
    async submitEditDinnerTable(req, res, next) {
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

    async changePassword(req, res, next) {
        res.render('changePassword',
            {
                layout: 'admin',
            })
    }
    async checkEqualPassword(req,res,next){
        var passOld = sha256(req.body.passOld)
        var data = await admin.findOne({_id: req.signedCookies.adminId, password: passOld})
        if(data == null) {
            res.send(false)
        }
        else {
            res.send(true)
        }
    }

    async submitChangePassword(req, res, next) {
        var passNew = sha256(req.body.passNew)
        var data = await admin.updateOne({_id: req.signedCookies.adminId},{
            password: passNew
        })
        res.clearCookie("adminId")
        res.redirect('/admin')
    }


}

module.exports = new SiteController();
