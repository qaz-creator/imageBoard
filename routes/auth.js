const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/', requireLogin, (req, res) => {
  res.json(req.user)
})

router.post('/signup', (req, res) => {
  const { name, email, password, profilePic } = req.body
  if (!email || !password || !name) {
    return res.status(422).json({ error: 'please add all the field' })
  }
  //   res.json({ message: 'successfully posted' })
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'User already registered' })
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          profilePic,
        })
        user
          .save()
          .then((user) => {
            //   res.json({ message: 'new user saved!' })
            res.json(user)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    })
    .catch((err) => console.log(err))
})

router.post('/signin', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({
      error: 'please provide email or password',
    })
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: 'Invalid Email' })
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json(savedUser)
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
          const {
            _id,
            name,
            email,
            followers,
            following,
            profilePic,
          } = savedUser
          res.json({
            token,
            user: { _id, name, email, followers, following, profilePic },
          })
        } else {
          return res.status(422).json({ error: 'Invalid password' })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
})
module.exports = router
