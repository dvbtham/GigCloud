const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const registerValidators = require('../validators/register');
const loginValidators = require('../validators/login');

router.post('/logout', authController.postLogout);
router.get('/login', authController.getLogin);
router.post('/login', loginValidators, authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', registerValidators, authController.postRegister);

module.exports = router;
