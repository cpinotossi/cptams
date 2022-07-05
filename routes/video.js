var express = require('express');
var router = express.Router();
var jwtams = require('../jwt.ams.js');

/* GET /video */
// Get HTML via views
router.get('/',
  async function(req, res) {
    if (!req.isAuthenticated()) {
      // Redirect unauthenticated requests to home page
      res.redirect('/')
    } else {
      let params = {
        active: { video: true},
        stream: { streamURL: "", posterURL:"", accessToken:""}
      };

      // Get the access token
      let accessToken;
      let result;
      try {
        result = await jwtams.getAccessToken(req);
        accessToken = result.jwt;
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not get access token. No Vidoe today.',
          debug: JSON.stringify(err)
        });
      }

      if (accessToken && accessToken.length > 0) {
        try {
          // Assign all needed Streaming parameter to params
          params.stream.accessToken = accessToken;
          params.stream.streamURLEncoded = encodeURIComponent(process.env.MEDIASERVICE_URL);
          params.stream.streamURL = process.env.MEDIASERVICE_URL;
          params.stream.posterURL = "images/sendepause.jpg";
          params.stream.payload = JSON.stringify(result.payload);
        } catch (err) {
          req.flash('error_msg', {
            message: 'Could not assign streaming params',
            debug: JSON.stringify(err)
          });
        }
      } else {
        req.flash('error_msg', 'Could not get an streaming access token');
      }
      res.render('video', params);
    }
  }
);

module.exports = router;