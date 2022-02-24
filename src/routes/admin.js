const express = require('express');
const router = express.Router();
const admincontroller = require('../app/controllers/AdminControllers');



// router.get('/:slug', sitecontroller.detailProduct);
router.get('/deleteFood/:slug', admincontroller.deleteFood);
router.get('/editFood/:slug', admincontroller.editFood);
router.post('/submitEditFood/:slug', admincontroller.submitEditFood);
router.get('/menu', admincontroller.menu);
router.post('/submitAddForm', admincontroller.submitAddForm);
router.get('/test', admincontroller.test);
router.get('/addFood', admincontroller.addFood);
router.get('/', admincontroller.index);

module.exports = router;
