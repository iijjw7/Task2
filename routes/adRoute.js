const express = require('express');
const adminController = require('../controllers/Admin');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Create a new student
router.post('/', authenticateToken, authorizeAdmin, adminController.createStudent);

// Get a student by ID
router.get('/:id', authenticateToken, authorizeAdmin, adminController.getStudentById);

// Get all students
router.get('/', authenticateToken, authorizeAdmin, adminController.getAllStudents);

// Update a student by ID
router.put('/:id', authenticateToken, authorizeAdmin, adminController.updateStudent);

// Delete a student by ID
router.delete('/:id', authenticateToken, authorizeAdmin, adminController.deleteStudent);

module.exports = router;
