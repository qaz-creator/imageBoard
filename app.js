const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const path = require('path')
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/keys')
// models
require('./models/user')
require('./models/post')

app.use(express.json())
app.use('/', express.static(__dirname + '/'))

//to make the images visible in the browser
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/profile', express.static(path.join(__dirname, 'profilePics')))

// routes
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

mongoose.connect(MONGOURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useNewUrlParser: true,
  useFindAndModify: false,
})
mongoose.connection.on('connected', () => {
  console.log('Connected to mongoDB')
})
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to mongoDB', err)
})

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => console.log(`Server is runnig on ${PORT}`))
