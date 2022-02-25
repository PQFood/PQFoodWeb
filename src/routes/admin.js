const express = require('express');
const router = express.Router();
const admincontroller = require('../app/controllers/AdminControllers');



router.get('/staff', admincontroller.staff);

router.get('/destroyFood/:slug', admincontroller.destroyFood);
router.get('/restoreFood/:slug', admincontroller.restoreFood);
router.get('/deleteFood/:slug', admincontroller.deleteFood);
router.get('/editFood/:slug', admincontroller.editFood);
router.post('/submitEditFood/:slug', admincontroller.submitEditFood);
router.get('/menu', admincontroller.menu);
router.post('/submitAddForm', admincontroller.submitAddForm);
router.get('/logout', admincontroller.logout);
router.get('/', admincontroller.index);

module.exports = router;
