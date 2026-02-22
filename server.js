require('dotenv').config();
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { graphql } = require('graphql');

const PORT = process.env.PORT || 3000;

async function startServer() {
    //connect to MongoDB
    await connectDB();
    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();
    server.applyMiddleware({app, path: '/graphql'});

    app.get('/', (req, res) => {
        res.json({message: 'Welcome to the Employee Management API',
            graphql_endpoint: '/graphql'
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
        });

}

startServer();