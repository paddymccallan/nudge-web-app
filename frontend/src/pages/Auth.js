import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
  state = {
    user: null,
    isLogin: false,//check local storage to set initial state
    hostUrl: window.location.href.indexOf('localhost') >-1 ? 'https://localhost:44347' : 'https://nudgeapi.herokuapp.com'
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.usernameE1 = React.createRef();
    this.passwordEl = React.createRef();
  }

  componentDidMount = () => {
    let user = localStorage.getItem('user');
    const shouldBeLoggedIn = user !== null ? true : false;
    if(shouldBeLoggedIn) {
      console.log(user);
      user = JSON.parse(user);
      this.context.login(user.userId, user.username, user.token)
    }
    this.setState({user: user, isLogin: shouldBeLoggedIn });
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const username = this.usernameE1.current.value;
    const password = this.passwordEl.current.value;

    if (username.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {//login 
      "Username": username,
      "Password": password,
    };

    if (!this.state.isLogin) {//register user
      requestBody = JSON.stringify({
          "Username": username,
          "Password": password,
        });
    }

    fetch(this.state.isLogin ? this.state.hostUrl+'/api/User/Authenticate' : this.state.hostUrl+'/api/User/Register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest'},
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData !== null) {
          fetch(this.state.hostUrl+'/api/User/GetLoggedInUser', {
            method: 'GET',      
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Requested-With':'XMLHttpRequest', 'Authorization': 'Bearer ' + resData},           
          }).then(r =>{
            if (r.status !== 200 && r.status !== 201) {
              throw new Error('Failed!');
            }
            return r.json();
          }).then(r1 => {
            if(r1 !== null){
              this.context.login(
                r1.Id,
                r1.UserName,
                resData
             );
             const user = {
               userId: r1.Id,
               username: r1.UserName,
               token: resData
             }
             //add user to local storage
             localStorage.setItem('user', JSON.stringify(user));//could add a 'remember me ternary here'
            }
          }).catch(err => {
            console.log(err);
          });      
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-group">
          <label htmlFor="email">Username</label>
          <input type="text" className="form-control" id="email" ref={this.usernameE1} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password"  className="form-control" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
