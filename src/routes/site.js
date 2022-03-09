const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/SiteControllers');


router.get('/search', sitecontroller.search);

router.post('/submitBookShip', sitecontroller.submitBookShip);
router.post('/booktable', sitecontroller.booktable);
router.get('/bookShip', sitecontroller.bookShip);
router.post('/login', sitecontroller.login);

router.get('/', sitecontroller.index);

module.exports = router;
