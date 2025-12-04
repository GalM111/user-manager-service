const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');

// Create new UserData
router.post('/userdata', userDataController.createUserData);

// Get all UserData
router.get('/userdata', userDataController.getAllUserData);

// Get UserData by ID
router.get('/userdata/:id', userDataController.getUserDataById);

// Get UserData by Email
router.get('/userdata/email/:email', userDataController.getUserDataByEmail);

// Update UserData by ID
router.put('/userdata/:id', userDataController.updateUserData);

// Delete UserData by ID
router.delete('/userdata/:id', userDataController.deleteUserData);

module.exports = router;
