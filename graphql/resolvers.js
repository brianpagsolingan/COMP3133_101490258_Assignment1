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

            const isPasswordValid = await user.comparePassword(password);
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
            const employees = await Employee.find().sort({created_at: -1});
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

        searchEmployeeByDesignationOrDepartment: async (_, {designation, department}) => {
            if (!designation && !department) {
                throw new UserInputError('At least one of designation or department must be provided');
            }
            const query = {};
            if (designation) {
                query.designation = designation;
            }
            if (department) {
                query.department = department;
            }
            const employees = await Employee.find(query).sort({created_at: -1});
            return employees.map(employee => ({
                    id: employee._id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    gender: employee.gender,
                    designation: employee.designation,
                    salary: employee.salary,
                    date_of_joining: employee.date_of_joining,
                    department: employee.department,
                    employee_photo: employee.employee_photo,
                    created_at: employee.created_at,
                    updated_at: employee.updated_at
            }));
        }

    },

    Mutation: {
        signup: async (_, {signupInput}) => {
            const {username, email, password} = signupInput;

            if (!username || username.length < 3 || username.length > 30) {
                throw new UserInputError('Username must be between 3 and 30 characters long');
            }
            validateEmail(email);
            validatePssword(password);
            //check if username or email already exists
            const existingUser = await User.findOne({username});
            if (existingUser) {
                throw new UserInputError('Username already exists');
            }
            const existingEmail = await User.findOne({email});
            if (existingEmail) {
                throw new UserInputError('Email already exists');
            }

            const newUser = new User({username,
                email: email.toLowerCase(), 
                password,
                created_at: new Date(),
                updated_at: new Date()
            });
            await newUser.save();
            return {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                created_at: newUser.created_at,
                updated_at: newUser.updated_at
            };


        },

        addEmployee: async (_, {addEmployeeInput}) => {
            const{
                first_name,
                last_name,
                email,
                gender,
                designation,
                salary,
                date_of_joining,
                department,
                employee_photo
            } = addEmployeeInput;

            if(!first_name || !last_name || !email || !designation || !salary || !date_of_joining || !department){
                throw new UserInputError('All fields except gender and employee_photo are required');
            }
            validateEmail(email);
            validateSalary(salary);
            const existingEmployee = await Employee.findOne({email: email.toLowerCase()});
            if (existingEmployee) {
                throw new UserInputError('Employee with this email already exists');
            }

            //Cloudinary upload

            let photoUrl = null;
            if (employee_photo) {
               try{
                    const uploadResult = await uploadtToCloudiinary(employee_photo, 'employees');
                    photoUrl = uploadResult.secure_url;
               }catch (error) {
                    throw new UserInputError('Failed to upload employee photo: ' + error.message);
               }
            }

            const newEmployee = new Employee({
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.toLowerCase(),
                gender: gender || null,
                designation: designation.trim(),
                salary: parseFloat(salary),
                date_of_joining: new Date(date_of_joining),
                department: department.trim(),
                employee_photo: photoUrl,
                created_at: new Date(),
                updated_at: new Date()
            });
            await newEmployee.save();
            return {
                success: true,
                message: 'Employee added successfully',
                employee: {id: newEmployee._id, ...newEmployee.toObject()}
            };
        },

        updateEmployee: async (_, {id, updateEmployeeInput}) => {
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                throw new UserInputError('Employee not found');
            }

            const{
                first_name,
                last_name,
                email,
                gender,
                designation,
                salary,
                date_of_joining,
                department,
                employee_photo
            } = updateEmployeeInput;

            if (email) validateEmail(email);
            if (salary !== undefined) validateSalary(salary);

            // check if email is being updated to an email that already exists
            if (email && email.toLowerCase() !== existingEmployee.email) {
                const existingEmail = await Employee.findOne({email: email.toLowerCase()});
                if (existingEmail) {
                    throw new UserInputError('Another employee with this email already exists');
                }
            }
            
            // build update object - only include fields that are provided in the input
            const updatedData = { updated_at: new Date() };
            if (first_name) updatedData.first_name = first_name.trim();
            if (last_name) updatedData.last_name = last_name.trim();
            if (email) updatedData.email = email.toLowerCase();
            if (gender) updatedData.gender = gender.trim();
            if (designation) updatedData.designation = designation.trim();
            if (salary !== undefined) updatedData.salary = parseFloat(salary);
            if (date_of_joining) updatedData.date_of_joining = new Date(date_of_joining);
            if (department) updatedData.department = department.trim();
            
            // new photo upload if employee_photo is provided
            if (employee_photo) {
                try{
                    const uploadResult = await uploadtToCloudiinary(employee_photo, 'employees');
                    updatedData.employee_photo = uploadResult.secure_url;
                }catch (error) {
                    throw new UserInputError('Failed to upload employee photo: ' + error.message);
                }
            }

            const updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                { $set: updatedData },
                { new: true, runValidators: true }
            )
            return {
                success: true,
                message: 'Employee updated successfully',
                employee: {id: updatedEmployee._id, ...updatedEmployee.toObject()}
            };
        },

        deleteEmployee: async (_, {id}) => {
            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                throw new UserInputError('Employee not found');
            }

            await Employee.findByIdAndDelete(id);
            return {
                success: true,
                message: `Employee "${existingEmployee.first_name} ${existingEmployee.last_name}" deleted successfully `
            };
    }
}
        
};

module.exports = resolvers;