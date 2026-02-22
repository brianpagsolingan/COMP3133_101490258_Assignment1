# COMP3133 - Assignment 1
### Employee Management System — GraphQL API Testing Queries

---

## 🔐 Authentication
This one already exists in the database so it will cause an error
### 1. Sign Up
```graphql
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
```

### 2. Log In
```graphql
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
```

---

## 👥 Employee Operations

### 3. Add Employee
```graphql
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
```

### 4. Get All Employees
```graphql
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
```

### 5. Get Employee by ID

```graphql
query {
  getEmployeeById(id: "YOUR_EMPLOYEE_ID_HERE") {
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
```

### 6. Update Employee

```graphql
mutation {
  updateEmployee(
    id: "YOUR_EMPLOYEE_ID_HERE"
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
```

### 7. Search by Designation or Department

**Search by Department:**
```graphql
query {
  searchEmployeeByDesignationOrDepartment(department: "Engineering") {
    id
    first_name
    last_name
    designation
    department
  }
}
```

**Search by Designation:**
```graphql
query {
  searchEmployeeByDesignationOrDepartment(designation: "Senior Engineer") {
    id
    first_name
    last_name
    designation
    department
  }
}
```

### 8. Delete Employee


```graphql
mutation {
  deleteEmployee(id: "YOUR_EMPLOYEE_ID_HERE") {
    success
    message
  }
}
```

---
