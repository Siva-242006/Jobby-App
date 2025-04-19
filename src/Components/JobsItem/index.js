import {Link} from 'react-router-dom'
import './index.css'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn, MdStar} from 'react-icons/md'

const JobsItem = props => {
  const {jobDetails} = props

  return (
    <li className="jobs-item-container">
      <Link to={`/jobs/${jobDetails.id}`} className="link-class">
        <div className="jobs-item-logo-title-container">
          <img
            src={jobDetails.companyLogoUrl}
            alt="company logo"
            className="company-logo-img"
          />
          <div>
            <h1 className="jobs-item-title">{jobDetails.title}</h1>
            <div className="rating-container">
              <MdStar className="rating-star" />
              <p className="rating-para">{jobDetails.rating}</p>
            </div>
          </div>
        </div>
        <div className="location-emp-type-package-container">
          <div className="location-emp-type-container">
            <div className="location-container">
              <MdLocationOn className="location-case-icons" />
              <p>{jobDetails.location}</p>
            </div>
            <div className="employment-type-container">
              <BsFillBriefcaseFill className="location-case-icons" />
              <p>{jobDetails.employmentType}</p>
            </div>
          </div>
          <p>{jobDetails.packagePerAnnum}</p>
        </div>
        <hr />
        <div className="jobs-description-container">
          <h1>Description</h1>
          <p>{jobDetails.jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobsItem
