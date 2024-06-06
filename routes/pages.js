const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();



router.get('/', (req, res) => {
    res.render('index', {})

})

router.get('/home', authController.getUsers);


router.get('/home', (req, res) => {
    res.render('home', {})

})

router.get('/register', (req, res) => {
    res.render('register', {})

})

module.exports = router;