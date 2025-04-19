import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header/index'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  const renderHomePage = () => (
    <div className="home-page-bg-container">
      <h1 className="home-page-heading-text">
        Find The Job That Fits Your Life
      </h1>
      <p className="home-page-description-text">
        Millions of people are searching for jobs, salary, information, company
        reviews. Find The jobs that fits in your abilities and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="find-job-button">
          Find Jobs
        </button>
      </Link>
    </div>
  )

  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div className="home-page-container">{renderHomePage()}</div>
    </>
  )
}

export default Home
