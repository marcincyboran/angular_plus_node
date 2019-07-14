const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {
    const token = req.header('X-Auth');
    const tokenPayload = jwt.verify(token, 'secret_key_string_change_it_to_env');
    req.customData = { email: tokenPayload.email, userId: tokenPayload.id }
    next();
  } catch (error) {
    res.status(401).send('Auth failed');
  }
}
