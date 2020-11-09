const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')
const multer = require('multer')
const path = require('path')
const shortid = require('shortid')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  },
})

const upload = multer({ storage })

router.get('/allpost', (req, res) => {
  Post.find()
    //   to expand postedBy,show id and name
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .then((posts) => {
      res.json({ posts })
    })
    .catch((err) => {
      console.log(err)
    })
})

// get the post of my following
router.get('/getsubpost', (req, res) => {
  // if postedby in the following list
  Post.find({postedBy:{$in:req.user.following}})
    //   to expand postedBy,show id and name
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .then((posts) => {
      res.json({ posts })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/createpost', requireLogin, upload.single('photo'), (req, res) => {
  const { title, body } = req.body

  // let photo = []

  if (!title || !body) {
    return res.status(422).json({ error: 'Please add all the fields' })
  }
  //   console.log(req.user)

  //   not show password
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    photo: 'http://localhost:5000/public/' + req.file.filename,
    postedBy: req.user,
  })
  post
    .save()
    .then((result) => {
      res.json({ result })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/mypost', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user.id })
    .populate('postedBy', '_id name')
    .then((myposts) => {
      res.json({ myposts })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true },
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    } else {
      res.json(result)
    }
  })
})

router.put('/unlike', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    } else {
      res.json(result)
    }
  })
})

router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  }
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true },
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err })
      } else {
        res.json(result)
      }
    })
})

// Delete post
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err })
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
})

module.exports = router
