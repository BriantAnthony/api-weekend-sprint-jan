var Users = require('../models/users');

module.exports = function(api, express, app, mongoose, config, bodyParser){

  // return all users (GET /api/users)
  api.get('/users', function(req, res) {
    Users.find({}, function(err, users) {
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      if(!users){
        res
        .status(404)
        .json({ success: false, message: 'No users found.' });
      }
      else {
        res.json({ success: true, count: users.length, data: users });
      }
    });
  });

  // return an individual users (GET /api/users/:user_id)
  api.get('/users/:user_id', function(req, res) {
    Users.findById(req.params.user_id, function(err, user) {
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      if(!user){
        res
        .status(404)
        .json({ success: false, message: 'User not found.' });
      }
      else {
        res.json({ success: true, data: user });
      }
    });
  });

  // update an individual user (PUT /api/users/:user_id)
  api.put('/users/:user_id', function(req, res) {
    Users.findById(req.params.user_id, function(err, user) {
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      if(!user){
        res
        .status(404)
        .json({ success: false, message: 'User not found.' });
      }
      else {
        user.firstName    = req.body.firstName;
        user.lastName     = req.body.lastName;
        user.email        = req.body.email;
        user.phone        = req.body.phone;

        user.lastUpdate   = Date.now();
        user.updateCount  = user.updateCount + 1;

        user.save(function(err, userObject) {
          if(err){
            res
            .status(400)
            .json({ success: false, message: err });
          }
          else {
            res.json({ success: true, message: 'Successfully updated.', data: userObject });
          }
        });
      }
    });
  });

  // delete an individual user (DELETE /api/users/:user_id)
  api.delete('/users/:user_id', function(req, res) {
    Users.findById(req.params.user_id, function(err, user) {
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      if(!user){
        res
        .status(404)
        .json({ success: false, message: 'User not found.' });
      }
      else {
        user.remove(function(err, user){
          res.json({ success: true, message: 'User successfully deleted.' });
        });
      }
    });
  });
};
