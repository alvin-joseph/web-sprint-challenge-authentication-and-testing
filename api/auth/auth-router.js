const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')

const tokenBuilder = require('./token-builder')

const { 
  validatePost, 
  checkUsernameExists,
  checkUsernameDoesNotExist } = require('../middleware/check-payload')

router.post('/register', validatePost, checkUsernameExists, (req, res, next) => {
  const { username, password } = req.body
  
  const hash = bcrypt.hashSync(password, 8)

  User.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)
});

router.post('/login', validatePost, checkUsernameDoesNotExist, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = tokenBuilder(req.user)
    res.status(200).json({
      message: `welcome, ${req.user.username}`,
      token,
    });
  } else {
    next({
      status: 401,
      message: 'invalid credentials'
    })
  }
});

module.exports = router
