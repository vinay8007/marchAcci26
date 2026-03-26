const express = require('express');
const router = express.Router();
const {createUser, getUserById, updateUser} = require('../controllers/userController');

router.post('/user',createUser);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
// router.delete('/user/:id', deleteUser);

module.exports = router;