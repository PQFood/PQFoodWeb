const express = require('express');
const router = express.Router();
const admincontroller = require('../app/controllers/AdminControllers');


router.post('/checkEqualPassword', admincontroller.checkEqualPassword);
router.post('/submitChangePassword', admincontroller.submitChangePassword);
router.get('/changePassword', admincontroller.changePassword);
router.post('/submitEditDinnerTable/:slug', admincontroller.submitEditDinnerTable);
router.get('/editDinnerTable/:slug', admincontroller.editDinnerTable);
router.get('/deleteDinnerTable/:slug', admincontroller.deleteDinnerTable);
router.post('/submitAddDinnerTable', admincontroller.submitAddDinnerTable);
router.get('/dinnerTable', admincontroller.dinnerTable);
router.post('/submitEditStaff/:slug', admincontroller.submitEditStaff);
router.get('/editStaff/:slug', admincontroller.editStaff);
router.get('/deleteStaff/:slug', admincontroller.deleteStaff);
router.post('/checkExists', admincontroller.checkExists);
router.post('/submitAddStaff', admincontroller.submitAddStaff);
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
