var eventController = require('./config/eventController.js');
var userController = require('./config/userController.js');
var aws = require ('aws-sdk');
var config = require('./config/authConfig');

module.exports = function (apiRouter, passport) {
  apiRouter.get('/events', eventController.getAllEvents);
  apiRouter.post('/events', eventController.addEvent);

  apiRouter.get('/events/:eventId', eventController.getEvent);
  apiRouter.put('/events/:eventId', eventController.editEvent);
  apiRouter.delete('/events/:eventId', eventController.deleteEvent);

  apiRouter.post('/users', userController.addUser);

  apiRouter.get('/loggedin', function(req, res) { res.send({ isLoggedIn: req.isAuthenticated() }); });

  apiRouter.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email ', 'public_profile', 'user_friends']}));

  apiRouter.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/#/',
      failureFlash: true
    }), function(req, res) {
      res.redirect('/#/dashboard/');
    });



  /*Local auth routes:
  apiRouter.post('/auth/signup', passport.authenticate('local-signup', {
    successRedirect : '/events', // redirect to the secure events section
    failureRedirect : '/', // redirect back to the home page if there is an error
    failureFlash : true // allow flash messages
  }));
  apiRouter.post('/auth/login', authController.login);*/

  apiRouter.get('/auth/logout',
    function (req, res) {
      req.logout();
      res.end();
    });

  apiRouter.get('/s3/sign', function(req, res){
    aws.config.update({accessKeyId: config.aws.AWS_ACCESS_KEY, secretAccessKey: config.aws.AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
      Bucket: 'eventify-photos',
      Key: req.query.file_name,
      Expires: 60,
      ContentType: req.query.file_type,
      ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
      if(err){
        console.log(err);
      }
      else{
        var return_data = {
          signed_request: data,
          url: 'https://eventify-photos.s3.amazonaws.com/'+req.query.file_name
        };
        res.write(JSON.stringify(return_data));
        res.end();
      }
    });
  });

/*
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log('isauthed?', req.isAuthenticated());
    if (req.isAuthenticated())
      return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
  }*/

  apiRouter.param('eventId', function(req, res, next, eventId){
    req.body.eventId = eventId;
    next();
  });


  apiRouter.param('eventId', function(req, res, next, eventId){
    req.body.eventId = eventId;
    next();
  });


};
