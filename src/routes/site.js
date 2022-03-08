const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/SiteControllers');


router.post('/submitBookShip', sitecontroller.submitBookShip);
router.get('/bookShipOnline', sitecontroller.bookShipOnline);

router.post('/booktable', sitecontroller.booktable);
router.post('/bookShip', sitecontroller.bookShip);
router.post('/login', sitecontroller.login);

router.get('/', sitecontroller.index);

module.exports = router;
