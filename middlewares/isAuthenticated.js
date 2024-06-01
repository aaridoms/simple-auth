const { expressjwt: jwt } = require('express-jwt');

const isAuthenticated = jwt({
  secret: process.env.SECRET_TOKEN,
  algorithms: ['HS256'],
  requestProperty: 'payload',

  getToken: (req) => {
    if(req.headers === undefined || req.headers.authorization === undefined) {
      return null;
    }

    const [bearer, token] = req.headers.authorization.split(' ');
    if(bearer !== 'Bearer') {
      return null;
    }
    return token;
  }
});

module.exports = isAuthenticated;