const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/SiteControllers');


router.get('/test', sitecontroller.test);

// router.get('/:slug', sitecontroller.detailProduct);
router.post('/booktable', sitecontroller.booktable);
router.post('/bookShip', sitecontroller.bookShip);
router.post('/login', sitecontroller.login);

router.get('/', sitecontroller.index);

module.exports = router;
