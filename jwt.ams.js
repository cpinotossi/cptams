const jwtSimple = require('jwt-simple');

module.exports = {
  //Import Modules
    getAccessToken: async function(req) {
      if (req.user) {
        // Get the stored token
        let storedToken = req.user.oauthToken;
        let name = storedToken.name;
        //Decode base64 key
        let data = process.env.MEDIASERVICE_AES_KEY;
        let jwtPrivateKey = Buffer.from(data, 'base64');
        //Define jwt alg to be used:
        let jwtHeader = {"alg": "HS256","typ": "JWT"};
        let duration = 1;
        let currenttime = Math.floor(new Date() / 1000);
        let expire = currenttime + (duration * 60 * 60);
        let notbefore = currenttime - (60)
        let jwtPayload = new Object();
        jwtPayload.iss = "cpt";
        jwtPayload.aud = "partner1";
        jwtPayload.name = name;
        jwtPayload.exp = expire;
        jwtPayload.nbf = notbefore;
        let result;
        let accessToken;
        try {
          accessToken = await jwtSimple.encode(jwtPayload, jwtPrivateKey, jwtHeader.algorithm);
          result = {
            "jwt":accessToken,
            "payload":jwtPayload
          };
        } catch (err) {
          req.flash('error_msg', {
            message: 'Could not get access token. No Vidoe today.',
            debug: JSON.stringify(err)
          });
        }
        return result;
      }
    }
  };
