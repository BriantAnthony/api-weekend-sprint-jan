var express     = require('express');
var app         = express();
var cors        = require('cors');
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var config      = require('./app/config/config');

// DB config
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// cors
app.use(cors());

// morgan for logging
app.use(morgan('dev'));

// body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// basic api routes
// -------------------
var api = express.Router();

api.get('/', function(req, res){
  res.json({ success: true, message: 'Welcome to our API.' });
});

var auth = require('./app/routes/auth')(api, express, app, mongoose, config, bodyParser);
var users = require('./app/routes/users')(api, express, app, mongoose, config, bodyParser);
var search = require('./app/routes/search')(api, express, app, mongoose, config, bodyParser);

// prepend /api to all routes
app.use('/api', api);

// start server
var port = process.env.PORT || 4000;
app.listen(port);
console.log('Listening at http://locahost:' + port);
