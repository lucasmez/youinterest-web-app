const   path = require('path'),
        express = require('express'),
        bodyParser = require('body-parser'),
        session = require('express-session'),
        flash = require('connect-flash'),
        db = require('./app_api/db'),	// Establish mongoDB connection and cache models  
        config = require('./config'),
        apiRoutes = require('./app_api/routes'),
        appRoutes = require('./app_server/routes');

const app = express();

const sess = {
    secret: config.SESSION.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
};

app.set('views', path.join(__dirname, "app_server", "views"));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: false}));
app.use(session(sess));
app.use(flash());

app.use((req, res, next) => {
    let sess = req.session;

    res.locals.loginMessage = req.flash('login') || null; 
    res.locals.account = sess.account || null;
    
    req.flash('login', "");
    
    next();
});

app.use("/api", apiRoutes);
app.use("/", appRoutes);
app.use(express.static(__dirname + '/public'));

app.listen(config.PORT, () => {
	console.log("Server listening on port ", config.PORT);
});
