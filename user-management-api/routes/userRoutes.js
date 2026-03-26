const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/users', authMiddleware, getAllUsers);
router.get('/user/:id', authMiddleware, getUserById);
router.put('/user/:id', authMiddleware, updateUser);
router.delete('/user/:id', authMiddleware, deleteUser);



module.exports = router;

//   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWJhYmQxZjgyZThkMTYwMTQ2MGU1MGIiLCJlbWFpbCI6ImFua2l0QGdtYWlsLmNvbiIsImlhdCI6MTc3Mzg1Nzg3MywiZXhwIjoxNzc0Mjg5ODczfQ.BDPA4ph9nzLCgBUOK7WVrUjmlb_-zYqfgZokAIFPELg