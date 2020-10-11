import React, { Component } from 'react';
import {BrowserRouter as Router, Route , Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken'
import {setCurrentUser} from './actions/authActions'
import {logoutUser} from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/profile/CreateProfile'
import EditProfile from './components/profile/EditProfile'
import ShowProfile from './components/profile/ShowProfile'
import store from './store'
import Topper from './components/layout/Topper'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import PostForm from './components/posts/PostForm'
import Posts from './components/posts/Posts'
import Post from './components/posts/Post'

import './App.css';

//Check for token

if(localStorage.jwtToken){
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // get user info and exp from token
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthentificated
  store.dispatch(setCurrentUser(decoded));
  // Logout user on token timeout
  const currentTime = Date.now() / 1000 ;
  if (decoded.exp<currentTime){
    //Logout User
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    //Redirect to login
    window.location.href = 'login';
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
      <div className="App">
        <Topper />
        <Route exact path="/" component={Landing}/>
        <div className="container">
         <Route exact path="/register" component={Register} />
         <Route exact path="/login" component={Login} />
        <Switch>
        <PrivateRoute exact path="/profile" component={Profile} />
        </Switch>
        <Route exact path="/profile/:handle" component={ShowProfile} />
        <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
        <Switch>
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
              </Switch>
              <Switch>
        <PrivateRoute exact path="/addpost" component={PostForm} />
        </Switch>
        <Route exact path="/posts" component={Posts} />
        <Route exact path="/post/:id" component={Post} />
         </div>
        <Footer />
        </div >
      </Router>
      </ Provider>
    );
  } 
}

export default App;
