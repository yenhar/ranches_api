const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();



router.get('/home',  authController.getUsers);
router.post('/register', authController.register)
router.post('/addhero', authController.addHero);
router.post('/delete-hero', authController.deleteHero);
router.post('/updatehero', authController.updateHero); 
router.post('/', authController.login);
router.post('/logout', authController.logout);

// router.post('/', authController.login);



module.exports = router;