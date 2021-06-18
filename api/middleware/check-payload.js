const validatePost = (req, res, next) => {
    const { username, password } = req.body;
    const valid = Boolean(username && password)
  
    if (valid) {
      next();
    } else {
      next({ status:422, message: 'username and password required' })
    }
}



module.exports = {
  validatePost
}