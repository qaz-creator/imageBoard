import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
/**
 * @author
 * @function Signin
 **/

const Signin = (props) => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      M.toast({ html: 'invalid email', classes: '#c62828 red darken-3' })
      return
    }
    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' })
        } else {
          // save the token in localStorage
          localStorage.setItem('jwt', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          dispatch({ type: 'USER', payload: data.user })
          M.toast({
            html: 'login successfully',
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
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>ImageBoard</h2>

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue lighten-2"
          type="submit"
          name="action"
          onClick={() => {
            PostData()
          }}
        >
          Sign in
        </button>
        <h5>
          <Link to="/signup">Doesn't have an account?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Signin
