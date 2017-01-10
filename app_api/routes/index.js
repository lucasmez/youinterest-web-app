const Router = require('express').Router;
const {users, interests, errorHandler} = require('../controllers');

const api = new Router();
module.exports = api;

// Users
api.get("/users", users.getUserByName);
api.get("/users/:userId", users.getOneUser);
api.post("/users", users.createUser);
api.post("/users/:userId/interest", users.addInterest);
api.put("/users/:userId", users.updateUser);
api.delete("/users/:userId", users.deleteUser);

// Interests
api.get("/interest", interests.getInterestByName);
api.get("/interest/:interestId", interests.getOneInterest);
api.post("/interest", interests.createInterest);
api.put("/interest/:interestId", interests.updateInterest);
api.delete("/interest/:interestId", interests.deleteInterest);

// Error handler
api.use(errorHandler);


