const admin = require('../models/admin');
const cloudinary = require('cloudinary').v2
const foodMenu = require('../models/foodMenu');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')

class SiteController {

    async index(req, res, next) {
        res.render(
            'homeAdmin', {
            layout: 'admin'
        })
    }
    
    async logout(req, res, next) {
        res.clearCookie("adminId")
        res.redirect('/')
    }

    async addFood(req, res, next) {
        res.render(
            'addFood', {
            layout: 'admin'
        })
    }

    async test(req, res, next) {
        res.render(
            'addFood', {
            layout: 'admin'
        })
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
        var menuFoods = await foodMenu.find({classify : 1})
        var menuDinks = await foodMenu.find({classify: 2})
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

    async deleteFood(req, res, next){
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
    
    async restoreFood(req, res, next){
        var slug = await req.params.slug
        var result = await foodMenu.restore({ slug: slug })
        res.redirect('/admin/editFood/'+slug)
    }

    async destroyFood(req, res, next){
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

    async staff(req, res, next){
        res.render('staffAdmin',
        {
            layout: 'admin',
        })
    }


}

module.exports = new SiteController();
