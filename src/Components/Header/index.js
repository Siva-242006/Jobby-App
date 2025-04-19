import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import './index.css'
import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

class Header extends Component {
  state = {width: window.innerWidth}

  componentDidMount() {
    window.addEventListener('resize', this.onWidthChange)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWidthChange)
  }

  onWidthChange = () => {
    this.setState({width: window.innerWidth})
  }

  onWebLogoClick = () => {
    const {history} = this.props
    history.push('/')
  }

  onLogoutClick = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  renderMobileView = () => (
    <div className="header-sm-view-container">
      <ul className="header-items-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-web-logo"
            />
          </Link>
        </li>
        <div>
          <li>
            <Link to="/" className="header-link-element">
              <IoMdHome className="header-sm-icons" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="header-link-element">
              <BsBriefcaseFill className="header-sm-icons" />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="header-sm-icon-button"
              onClick={this.onLogoutClick}
            >
              <FiLogOut className="header-sm-icons" />
            </button>
          </li>
        </div>
      </ul>
    </div>
  )

  renderDesktopView = () => (
    <div className="header-lg-view-container">
      <ul className="header-items-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-web-logo"
              onClick={this.onWebLogoClick}
            />
          </Link>
        </li>
        <div>
          <li>
            <Link to="/" className="header-link-element">
              Home
            </Link>
          </li>

          <li>
            <Link to="/jobs" className="header-link-element">
              Jobs
            </Link>
          </li>
        </div>
        <li>
          <button
            type="button"
            className="header-logout-btn"
            onClick={this.onLogoutClick}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )

  render() {
    const {width} = this.state
    return (
      <div className="header-bg-container">
        {width >= 768 ? this.renderDesktopView() : this.renderMobileView()}
      </div>
    )
  }
}

export default withRouter(Header)
