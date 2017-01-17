const Router = require('express').Router;
const {users, interests, errorHandler} = require('../controllers');

const api = new Router();
module.exports = api;

// Users
api.get("/users", users.getUsers);     // Expects name and/or interest queries
api.get("/users/:userId", users.getOneUser);
api.post("/authenticate", users.authenticate);
api.post("/users", users.createUser);
api.post("/users/:userId/interest", users.addInterest);
api.put("/users/:userId", users.updateUser);
api.delete("/users/:userId", users.deleteUser);
api.delete("/users/:userId/interest", users.deleteInterest);

// Interests
api.get("/interests", interests.getInterests);  // Expects query parameters
api.get("/interest/:interestId", interests.getOneInterest);
api.post("/interest", interests.createInterest);
api.put("/interest/:interestId", interests.updateInterest);
api.delete("/interest/:interestId", interests.deleteInterest);

// Error handler
api.use(errorHandler);


