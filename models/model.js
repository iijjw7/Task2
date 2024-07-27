const mongoose = require('mongoose');
const Bcrypt = require('Bcrypt');
const validator = require('validator');
const { resetPassword } = require('../controllers/auth');

// Helper function to validate password strength
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// Define the Student schema
const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Firstname is required'],
        validate: {
            validator: (v) => /^[A-Za-z]+$/.test(v),
            message: 'Firstname must contain only English letters'
        }
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required'],
        validate: {
            validator: (v) => /^[A-Za-z]+$/.test(v),
            message: 'Lastname must contain only English letters'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Must be a valid email address'
        }
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        validate: {
            validator: (v) => /^[A-Za-z0-9]+$/.test(v),
            message: 'Username must contain only English letters and numbers'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: validatePassword,
            message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character'
        }
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    resetPasswordToken : String,
    resetPasswordExpires : Date,
    grade: {
        type: Number,
        required: [true, 'Grade is required'],
        min: [0, 'Grade must be at least 0'],
        max: [100, 'Grade must be at most 100']
    },
    courses: {
        type: [String],
        required: [true, 'Courses are required'],
        validate: {
            validator: (v) => v.length > 0,
            message: 'Courses array cannot be empty'
        }
    }
});

studentSchema.pre('save',async function(next){
    if(this.isModified('password')|| this.isNew){
        const salt = await bcrypt.getSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
    }
    next();
});
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
