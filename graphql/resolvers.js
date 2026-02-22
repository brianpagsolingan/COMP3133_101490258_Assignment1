const {UserInputError, AuthenticationError} = require('apollo-server-express');
const {GraphQLScalarType, Kind} = require('graphql');
const User = require('../models/User');
const Employee = require('../models/Employee');
const validator = require('validator');


// Custom scalar type for Date
const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom scalar type for Date',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
            return new Date(ast.value);
        }
        return null;
    }
});

// validation functions
const validatePssword = (password) => {
    if (!password || password.length < 6) {
        throw new UserInputError('Password must be at least 6 characters long');
    }
}

const validateEmail = (email) => {
    if (!email || !validator.isEmail(email)) {
        throw new UserInputError('Please enter a valid email address');
    }
}
const validateSalary = (salary) => {
    if (salary === undefined || salary < 1000) {
        throw new UserInputError('Salary must be at least 1000');
    }
}


