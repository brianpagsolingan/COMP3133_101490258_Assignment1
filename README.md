# COMP 3133 ASSIGNMENT 1 # 

** Postman Queries for Testing **

* Sign Up *

mutation {
  signup(signupInput: {
    username: "brian.pagsolingan"
    email: "brian@example.com"
    password: "password123"
  }) {
    id
    username
    email
  }
}

* Log in * 

query {
  login(loginInput: {
    username: "brian.pagsolingan"
    password: "password123"
  }) {
    id
    username
    email
  }
}

* Add Employee

mutation {
  addEmployee(addEmployeeInput: {
    first_name: "Old"
    last_name: "Man"
    email: "oldman_jenkins@example.com"
    gender: "Male"
    designation: "Engineer"
    salary: 75000
    date_of_joining: "2024-01-15"
    department: "Engineering"
    employee_photo: "https://wallpapers.com/images/high/funny-old-man-pictures-29zq8pp6pi1gcap8.jpg"
  }) {
    success
    message
    employee {
      id
      first_name
      last_name
    }
  }
}

* Get All Employees *

query {
  getAllEmployees {
    id
    first_name
    last_name
    email
    salary
    designation
    employee_photo
    created_at
    updated_at
  }
}

* Get by ID *

query {
  getEmployeeById(id: "699b87ba7d44b1a6a412ecee") {
    id
    first_name
    last_name
    email
    designation
    department
    salary
    employee_photo
    created_at
    updated_at
  }
}

* Update Employee *

mutation {
  updateEmployee(
    id: "699b87ba7d44b1a6a412ecee"
    updateEmployeeInput: {
      designation: "Senior Engineer"
      salary: 95000
    }
  ) {
    success
    message
    employee {
      id
      designation
      salary
      updated_at
    }
  }
}

* Search By Designation or Department *

query {
  searchEmployeeByDesignationOrDepartment(department: "Engineering") {
    id
    first_name
    last_name
    designation
    department
  }
}

query {
  searchEmployeeByDesignationOrDepartment(designation: "Senior Engineer") {
    id
    first_name
    last_name
    designation
    department
  }
}

* Delete By ID *

mutation {
  deleteEmployee(id: "699b87ba7d44b1a6a412ecee") {
    success
    message
  }
}