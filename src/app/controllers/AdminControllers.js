const admin = require('../models/admin');
const cloudinary = require('cloudinary').v2
const foodMenu = require('../models/foodMenu');


class SiteController {

    async index(req, res, next) {
        res.render(
            'homeAdmin', {
            layout: 'admin'
        })
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
        req.session.message = {
            type: 'success',
            intro: 'Thêm thực đơn thành công!',
            message: ''
        }
        res.redirect('/admin')
    }

}

module.exports = new SiteController();
