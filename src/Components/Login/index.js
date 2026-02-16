import {Component} from 'react'
import {withRouter, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    errorMsg: '',
  }

  onUsernameChange = event => {
    this.setState({usernameInput: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({passwordInput: event.target.value})
  }

  onLogin = async event => {
    event.preventDefault()
    const {history} = this.props
    const {usernameInput, passwordInput} = this.state
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({
        usernameInput: '',
        passwordInput: '',
        errorMsg: '',
      })
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      history.replace('/')
    } else {
      this.setState({
        errorMsg: data.error_msg,
      })
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    const {usernameInput, passwordInput, errorMsg} = this.state
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-route-bg-container">
      <p className="login-test-credential">
          Test Credentials: <br />
          Username: rahul - Password: rahul@2021
        </p>
        <div className="login-route-input-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-route-input-logo"
          />
          <form onSubmit={this.onLogin}>
            <label htmlFor="username" className="login-label-text">
              USERNAME
            </label>
            <br />
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="login-input-field"
              value={usernameInput}
              onChange={this.onUsernameChange}
            />
            <label htmlFor="password" className="login-label-text">
              PASSWORD
            </label>
            <br />
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="login-input-field"
              value={passwordInput}
              onChange={this.onPasswordChange}
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          {errorMsg !== '' && (
            <p className="login-error-message">* {errorMsg}</p>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Login)
