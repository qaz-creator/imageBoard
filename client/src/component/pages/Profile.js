import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import axios from 'axios'
/**
 * @author
 * @function Profile
 **/

const Profile = (props) => {
  const { state, dispatch } = useContext(UserContext)
  const [mypics, setPics] = useState([])
  const [image, setImage] = useState('')
  useEffect(() => {
    // console.log(state.name)
    fetch('/mypost', {
      headers: {
        Authorization: `${window.localStorage.getItem('jwt')}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.myposts)
        // console.log(result)
      })
  }, [])

  useEffect(() => {
    if (image) {
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', 'instagram')
      data.append('cloud_name', 'ddlmfrw8i')
      fetch('https://api.cloudinary.com/v1_1/ddlmfrw8i/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch('/updateprofilepic', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${window.localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
              profilePic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result)
              localStorage.setItem(
                'user',
                JSON.stringify({
                  ...state,
                  profilePic: result.data.profilePic,
                }),
              )
              dispatch({
                type: 'UPDATEPROFILEPIC',
                payload: result.data.profilePic,
              })
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [image])
  const updatePhoto = (file) => {
    setImage(file)

    // window.location.reload()
  }

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div
        style={{
          margin: '18px 0px',
          borderBottom: '1px solid grey',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <img
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '80px',
              }}
              src={state ? state.profilePic : 'loading'}
            />
          </div>
          <div>
            <h4>{state ? state.name : 'loading'}</h4>
            <h5>{state ? state.email : 'loading'}</h5>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '108%',
              }}
            >
              <h6>{mypics.length} posts</h6>
              <h6>{state ? state.followers.length : '0'} followers</h6>
              <h6>{state ? state.following.length : '0'} following</h6>{' '}
            </div>
          </div>
        </div>
        <div className="file-field input-field" style={{ margin: '10px' }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0])
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={(file) => {
              updatePhoto(file)
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Profile
