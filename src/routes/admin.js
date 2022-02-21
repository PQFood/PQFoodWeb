const express = require('express');
const router = express.Router();
const admincontroller = require('../app/controllers/AdminControllers');


// router.get('/test', admincontroller.test);

// router.get('/:slug', sitecontroller.detailProduct);

router.get('/test', admincontroller.test);

router.get('/addFood', admincontroller.addFood);
router.get('/', admincontroller.index);

module.exports = router;
