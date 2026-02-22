const e = require('express');
const mongoose = require('mongoose');
const validator = require('validator');

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name must be less than 50 characters long']
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name must be less than 50 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function(email) {
                return validator.isEmail(email);
            },
            message: 'Please enter a valid email address'
        }
    },
    gender:{
        type: String,
    },
    designation: {
        type: String,
        required: [true, 'Designation is required'],
        trim: true
    },
    salary:{
        type: Number,
        required: [true, 'Salary is required'],
        min: [1000, 'Salary must be at least 1000']
    },
    date_of_joining: {
        type: Date,
        required: [true, 'Date of joining is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    employee_photo:{
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    }
}, 
{   
    timestamps: false,
    versionKey: false
});

employeeSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updated_at: new Date() });
    next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;