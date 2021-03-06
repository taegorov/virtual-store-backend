'use strict';

const express = require('express');
const authRouter = express.Router();

const { user } = require('../models');
const basicAuth = require('../auth/middleware/basic.js')
const bearerAuth = require('../auth/middleware/bearer.js')
const permissions = require('../auth/middleware/acl.js')

console.log('✔ file loaded');

authRouter.post('/signup', async (req, res, next) => {
  console.log('got here');
  try {
    let userRecord = await user.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    // res.status(201).json(output);
    res.status(200).send({ success: true, message: `User Created: ${output.user.username}`, data: output });
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  console.log('req user: ', req.user)
  const user = {
    user: req.user,
    token: req.user.token
  };
  // res.status(200).json(user);
  res.status(200).send({ success: true, message: `Welcome, ${user.user.username}`, data: user });
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const userRecords = await user.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, permissions('create'), async (req, res, next) => {
  res.status(200).send('Welcome to the secret area')
});

module.exports = authRouter;
