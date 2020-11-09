import './App.css'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import Navbar from './component/Navbar'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './component/pages/Home'
import Signin from './component/pages/Signin'
import Signup from './component/pages/Signup'
import Profile from './component/pages/Profile'
import CreatePost from './component/pages/CreatePost'
import { reducer, initialState } from './reducers/userReducer'
import UserProfile from './component/pages/UserProfile'
import SubscribedUserPosts from './component/pages/SubscribedUserPosts'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    // parse the string into an object
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
      // history.push('/')
    } else {
      history.push('/signin')
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/signin">
        <Signin />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/create">
        <CreatePost />
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
