const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token;

  if(token){
      jwt.verify(token, req.app.get('api_secret_key'), (error, decoded) => {
         if(error){
             res.json({
                 status: false,
                 notification: 'Failed to authenticate token.'
             })
         }else{
             //console.log(decoded);
             req.decode = decoded;
             next()
         }
      });
  }else{
      res.json({
          status: false,
          notification: 'No token provided.'
      })
  }
};
