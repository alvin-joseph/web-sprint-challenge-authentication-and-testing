const User = require('../users/users-model')

const validatePost = (req, res, next) => {
    const { username, password } = req.body;
    const valid = Boolean(username && password)
  
    if (valid) {
      next();
    } else {
      next({ status:422, message: 'username and password required' })
    }
}

const checkUsernameDoesNotExist = async (req, res, next) => {
  const { username } = req.body
  try {
    const [user] = await User.findBy({ username })
    if (!user) {
      next({
        status: 401,
        message: 'invalid credentials'
      })
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    next(err)
  }
}

const checkUsernameExists = async (req, res, next) => {
  const { username } = req.body
  try {
    const [user] = await User.findBy({ username })
    if (user) {
      next({
        status: 401,
        message: 'username taken'
      })
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  validatePost,
  checkUsernameExists,
  checkUsernameDoesNotExist
}