const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {
    const token = req.header('X-Auth');
    jwt.verify(token, 'secret_key_string_change_it_to_env');
    next();
  } catch (error) {
    res.status(401).send('Auth failed');
  }
}
