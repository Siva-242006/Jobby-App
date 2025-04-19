import {Component} from 'react'
import './index.css'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Header from '../Header/index'

class JobsItemDetails extends Component {
  state = {
    jobItemDetails: {},
    isJobDetailsApiGetError: false,
    isJobDetailsLoading: false,
  }

  componentDidMount() {
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({isJobDetailsLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      const updatedJobDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),
      }
      const updatedSimilarJobsDetails = data.similar_jobs.map(job => ({
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        title: job.title,
        location: job.location,
        rating: job.rating,
      }))
      this.setState({
        jobItemDetails: {
          jobDetails: updatedJobDetails,
          similarJobs: updatedSimilarJobsDetails,
        },
        isJobDetailsLoading: false,
      })
    } catch (error) {
      this.setState({isJobDetailsApiGetError: true, isJobDetailsLoading: false})
    }
  }

  onJobsFailureRetryClick = () => {
    this.getJobsDetails()
  }

  renderJobItemDetailsUI = () => {
    const {
      jobItemDetails,
      isJobDetailsLoading,
      isJobDetailsApiGetError,
    } = this.state
    const jobDetails = jobItemDetails.jobDetails || {}
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      title,
      lifeAtCompany = {},
      location,
      packagePerAnnum,
      rating,
      skills = [],
    } = jobDetails
    if (isJobDetailsLoading) {
      return (
        <div className="jobs-loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (isJobDetailsApiGetError) {
      return (
        <div className="jobs-api-failure-view-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-view-img"
          />
          <h1 className="jobs-failure-view-para">Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for.</p>
          <button
            type="button"
            className="jobs-api-failure-button"
            onClick={this.onJobsFailureRetryClick}
          >
            Retry
          </button>
        </div>
      )
    }
    return (
      <>
        <div className="job-details-container">
          <div className="job-logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-company-logo-img"
            />
            <div>
              <h1 className="job-details-job-title">{title}</h1>
              <p className="job-details-rating-para">
                <img
                  src="https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000"
                  alt="rating star"
                  className="job-details-rating-star"
                />
                {rating}
              </p>
            </div>
          </div>
          <div className="job-details-location-emp-type-package-container">
            <div className="job-details-location-emp-type-container">
              <div>
                <MdLocationOn className="job-details-location-case-icons" />
                <p>{location}</p>
              </div>
              <div>
                <BsFillBriefcaseFill className="job-details-location-case-icons" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="job-details-job-description-container">
            <div className="job-details-description-website-link-container">
              <h1>Description</h1>
              <a href={companyWebsiteUrl}>
                Visit <FiExternalLink className="visit-link-icon" />
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <div>
            <h1 className="skills-text">Skills</h1>
            <ul className="skills-container">
              {skills.map(skill => (
                <li key={skill.name} className="skill-container">
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="skill-image"
                  />
                  <p>{skill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="life-at-company-text">Life at Company</h1>
            <div className="life-at-company-description-container">
              <p>{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company-img"
              />
            </div>
          </div>
        </div>
        {this.renderSimilarJobsUI()}
      </>
    )
  }

  renderSimilarJobsUI = () => {
    const {jobItemDetails} = this.state
    const {similarJobs = []} = jobItemDetails
    return (
      <div>
        <h1 className="similar-jobs-text">Similar Jobs</h1>
        <ul className="similar-jobs-ul-container">
          {similarJobs.map(jobs => (
            <li key={jobs.id} className="similar-jobs-li-container">
              <div className="job-logo-title-container">
                <img
                  src={jobs.companyLogoUrl}
                  alt="similar job company logo"
                  className="similar-jobs-company-logo-img"
                />
                <div>
                  <h1 className="similar-job-title">{jobs.title}</h1>
                  <p className="similar-rating-para">
                    <img
                      src="https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000"
                      alt="rating star"
                      className="similar-rating-star"
                    />
                    {jobs.rating}
                  </p>
                </div>
              </div>
              <div className="similar-job-description-container">
                <h1>Description</h1>
                <p>{jobs.jobDescription}</p>
              </div>

              <div className="similar-location-emp-type-package-container">
                <div className="similar-location-emp-type-container">
                  <div>
                    <MdLocationOn className="similar-location-case-icons" />
                    <p>{jobs.location}</p>
                  </div>
                  <div>
                    <BsFillBriefcaseFill className="similar-location-case-icons" />
                    <p>{jobs.employmentType}</p>
                  </div>
                </div>
                <p>{jobs.packagePerAnnum}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="job-item-details-bg-container">
          {this.renderJobItemDetailsUI()}
        </div>
      </>
    )
  }
}

export default JobsItemDetails
