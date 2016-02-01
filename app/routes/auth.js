var basicAuth = require('basic-auth');
var Users = require('../models/users');

module.exports = function( api, express, app, mongoose, config, bodyParser ){

  // create new users (POST /api/register)
  api.post('/register', function(req, res){
    var credentials = req.body.username || req.params['username'];
    if(credentials){
      Users.findOne({ username: credentials }, function(err, user){
        if(err){
          res
          .status(400)
          .json({ success: false, message: err });
        }
        if(user){
          res
          .status(403)
          .json({ success: false, message: 'Signup failed. User already exists.' });
        }
        else {
          var newUser = new Users();
            newUser.username    = req.body.username || req.params.username;
            newUser.pwd         = req.body.pwd || req.params.pwd;
            newUser.signupDate  = Date.now();

          newUser.save(function(err, userObject){
            if(err){
              res
              .status(400)
              .json({ success: false, message: err });
            }
            else {
              res.json({ success: true, message: 'Signup successful.', data: userObject });
            }
          });
        }
      });
    }
  });

  // Login a user (POST /api/login)
  api.post('/login', function(req, res) {
    var credentials = req.body.username || req.params.username;
    Users.findOne({ username: credentials }).select('+pwd').exec(function(err, user){
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      if(!user){
        res
        .status(403)
        .json({ success: false, message: 'Authentication failed.' });
      }
      else if(user.pwd !== req.body.pwd || req.params.pwd){
        res.json({ success: false, message: 'Authentication failed.' })
      }
      else {
        user.lastLogin = Date.now();
        user.save(function(err, userObject){
          if(err){
            res
            .status(400)
            .json({ successful: false, message: err });
          }
          else {
            res.json({ success: true, data: userObject });
          }
        });
      }
    });
  });

  // http basic authentication middleware checks for Authorization header
  api.use(function(req, res, next) {

    var user = basicAuth(req);

    // reusable unauthorized error handling
    function unauthorized(res){
      res.status(401)
      .set('WWW-Authenticate', 'Basic realm=Authorization Required')
      .json({ success: false, message: 'Could not authorize user.' });
    }

    if(user && user.name && user.pass){

      Users.findOne({username: user.name}, function(err, users){
        if(err){
          return res.status(400).json({ success: false, message: err });
        }
        if(users){
          return next();
        }
        else {
          return unauthorized(res);
        }
      });
    }
    else {
      return unauthorized(res);
    }
  });

};
