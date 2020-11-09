import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
const axios = require('axios')
/**
 * @author
 * @function CreatePost
 **/

const CreatePost = (props) => {
  const history = useHistory()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [photo, setPhoto] = useState('')

  const postDetails = () => {
    const data = new FormData()
    data.append('photo', photo)
    data.append('title', title)
    data.append('body', body)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${window.localStorage.getItem('jwt')}`,
      },
    }
    axios
      .post('/createpost', data, config)
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' })
        } else {
          M.toast({
            html: 'Created post Successfully',
            classes: '#43a047 green darken-1',
          })
          history.push('/')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div
      className="card input-field"
      style={{
        margin: '30px auto',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input
            type="file"
            onChange={(e) => {
              setPhoto(e.target.files[0])
            }}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={() => postDetails()}
      >
        Submit post
      </button>
    </div>
  )
}

export default CreatePost
