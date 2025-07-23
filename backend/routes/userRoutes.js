const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', userController.createUser);
router.get('/', verifyToken, authorizeRoles('admin'), userController.getAllUsers);
router.get('/profile', verifyToken, userController.getProfile);
router.get('/:id', userController.getUserById);


module.exports = router;
