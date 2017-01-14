const Router = require('express').Router;
const {interestCtrl, userCtrl, errorHandler, loginCtrl, accountCtrl} = require('../controllers');

const app = new Router();
module.exports = app;


//app.get("/interest/:interestTitle", interestCtrl);
app.get("/user/:userName", userCtrl);
app.get("/login", loginCtrl.loginRender);
app.get("/logout", loginCtrl.doLogout);
app.post("/login", loginCtrl.doLogin);

app.get("/account", accountCtrl); // Return account info. if user is logged in. Used in the SPA

app.use(errorHandler);