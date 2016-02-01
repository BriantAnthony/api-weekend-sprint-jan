var Users = require('../models/users');
var Search = require('../models/search');
var rp = require('request-promise');

module.exports = function(api, express, app, mongoose, config, bodyParser){

  // clear text search queries db for matching users
  api.get('/search', function(req, res) {
    var query = Users.find({ $text: { $search: req.query.q } });
    query.select('username email firstName lastName');
    query.exec(function(err, results) {
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      else if(!results || results.length == 0){
        res
        .status(404)
        .json({ success: false, message: 'No results.', count: 0, query: req.query.q });
      }
      else {
        var queryLog = new Search();
          queryLog.query = req.query.q;
          queryLog.user = req.headers['user-id'];
          queryLog.timestamp = Date.now();
          queryLog.results = results.length;

        queryLog.save(function(err, queryLog){
          if(err){
            console.log(err);
          }
          else {
            console.log('Logged Search: ' + queryLog);
            res.json({ success: true, count: results.length, query: req.query.q, data: results });
          }
        });
      }
    });
  });

  // return universal search history
  api.get('/search/history', function(req, res) {
    var query = Search.find({});
    query.populate({ path: 'user', select: 'username firstName lastName' });
    query.sort('-timestamp');
    query.exec(function(err, results){
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      if(!results){
        res
        .status(404)
        .json({ success: false, message: 'No queries in database.' });
      }
      else {
        res.json({ success: true, count: results.length, data: results });
      }
    });
  });

  // return search history for an individual user
  api.get('/search/history/:user_id', function(req, res) {
    var query = Search.find({ user: req.params.user_id });
    query.populate({ path: 'user', select: 'username firstName lastName' })
    query.sort('-timestamp');
    query.exec(function(err, results){
      if(err){
        res
        .status(400)
        .json({ success: false, message: err });
      }
      if(!req.params.user_id){
        res
        .status(403)
        .json({ success: false, message: 'No user id entered.' });
      }
      if(!results){
        res
        .status(404)
        .json({ success: false, message: 'No queries in database for this user.' });
      }
      else {
        var userObject = results[0].user;
        var User = {};

        User.name = userObject.firstName + ' ' + userObject.lastName;
        User.username = userObject.username;

        res.json({ success: true, count: results.length, user: User, data: results });
      }
    });
  });

  // translate a phrase into a GIF via Giphy API
  api.get('/search/giphy/translate', function(req, res){
    // request options
    var options = {
      uri: 'http://api.giphy.com/v1/gifs/translate',
      qs: {
        s : req.query.q,
        api_key : config.giphyKey
      },
      headers: {
        'User-Agent': 'izi'
      },
      json: true
    };

    // http request and logging
    rp(options)
      .then(function(response) {
        var queryLog = new Search();
          queryLog.query = req.query.q;
          queryLog.user = req.headers['user-id'];
          queryLog.timestamp = Date.now();
          queryLog.results = response.data.embed_url;

        queryLog.save(function(err, queryLog){
          if(err){
            console.log(err);
          }
          else {
            console.log('Logged Search: ' + queryLog);
            res.json({ success: true, data: response.data, query: queryLog.query });
          }
        })
      })
      .catch(function(err) {
        res.json({ success: false, message: err });
      });
  });
}
