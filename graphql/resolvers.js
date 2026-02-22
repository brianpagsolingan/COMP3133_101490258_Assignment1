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


const resolvers = {
    Date: DateScalar,
    
    Query: {
        login: async (_, {loginInput}) => {
            const {username, password} = loginInput;

            if (!username || !password) {
                throw new UserInputError('Username and password are required');
            }
            const user = await User.findByCredentials(username);
            if (!user) {
                throw new AuthenticationError('Invalid username ');
            }

            const isPasswordValid = await user.isPasswordValid(password);
            if (!isPasswordValid) {
                throw new AuthenticationError('Invalid password');
            }
            return{
                id: user._id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at
            };
        },

        getAllEmployees: async () => {
            const employees = (await Employee.find()).sort({created_at: -1});
            return employees.map(employee => ({
                id: employee._id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                created_at: employee.created_at,
                updated_at: employee.updated_at
            }));
        },
        getEmployeeById: async (_, {id}) => {
            const employee = await Employee.findById(id);
            if (!employee) {
                throw new UserInputError('Employee not found');
            }
            return {id: employee._id, ...employee.toObject()};
        },

        searchEmployeeByDesginationOrDepartment: async (_, {designation, department}) => {
            if (!designation && !department) {
                throw new UserInputError('At least one of designation or department must be provided');
            }
            
    }
};