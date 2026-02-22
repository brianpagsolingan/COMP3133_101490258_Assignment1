const {gql} = require('apollo-server-express');

const typeDefs = gql`
    scalar Date
    # User type definition
    type User{
        id: ID!
        username: String!
        email: String!
        created_at: Date!
        updated_at: Date!
        }
    # Employee type definition    
    type Employee{
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        designation: String!
        salary: Float!
        date_of_joining: Date!
        department: String!
        employee_photo: String
        created_at: Date
        updated_at: Date
        }

    
    type EmployeeResponse{
        success: Boolean!
        message: String
        employee: Employee
    }

    type DeleteResponse{
        success: Boolean!
        message: String
    }
    
    #Input types 
    
    input SignupInput{
        username: String!
        email: String!
        password: String!
    }
    
    input LoginInput{
        username: String!
        password: String!
    }   
    
    input AddEmployeeInput{
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        designation: String!
        salary: Float!
        date_of_joining: Date!
        department: String!
        employee_photo: String
    }
    
    input UpdateEmployeeInput{
        first_name: String
        last_name: String
        email: String
        gender: String
        designation: String
        salary: Float
        date_of_joining: Date
        department: String
        employee_photo: String
    }
        
    # Queries

    type Query{
        login(loginInput: LoginInput!): User!

        getAllEmployees: [Employee!]!
        getEmployeeById(id: ID!): Employee

        searchEmployeeByDesignationOrDepartment(
        department: String
        designation: String
        ): [Employee!]!

    }
    
    # Mutations
        
    type Mutation{
        signup(signupInput: SignupInput!): User!
        addEmployee(addEmployeeInput: AddEmployeeInput!): EmployeeResponse!
        updateEmployee(id: ID!, updateEmployeeInput: UpdateEmployeeInput!): EmployeeResponse!
        deleteEmployee(id: ID!): DeleteResponse!
    }
`;

module.exports = typeDefs;