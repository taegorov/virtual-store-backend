'use strict';

const { user } = require('../../models')

module.exports = async (req, res, next) => {

  console.log('🌶getting there!🥒')
  try {
    // console.log('req headers ☀️', req.headers)
    if (!req.headers.authorization) { _authError() }

    const token = req.headers.authorization.split(' ').pop();
    // console.log('TOKEN TOKEN TOKEN', token)
    const validUser = await user.authenticateBearer(token);
    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Invalid Login');
  }
}
