const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic:{
    type:String,
    default:'https://icons-for-free.com/iconfiles/png/512/avatar+person+profile+user+icon-1320086059654790795.png'
  },
  followers: [{ type: ObjectId, ref: 'User' }],
  following: [{ type: ObjectId, ref: 'User' }],
})

mongoose.model('User', userSchema)
