const {UserInputError, AuthenticationError} = require('apollo-server-express');
const {GraphQLScalarType, Kind} = require('graphql');
const User = require('../models/User');
const Employee = require('../models/Employee');
const validator = require('validator');