import {Component} from 'react'
import './index.css'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header/index'
import JobsItem from '../JobsItem/index'

class Jobs extends Component {
  state = {
    width: window.innerWidth,
    profileDetails: {},
    isProfileLoading: true,
    isProfileApiGetError: false,
    jobsList: [],
    isJobsLoading: true,
    isJobsApiGetError: false,
    searchFilter: '',
    selectedEmployeesTypeFilter: [],
    selectedSalaryRangeFilter: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
    window.addEventListener('resize', this.onWidthChange)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWidthChange)
  }

  onWidthChange = () => {
    this.setState({width: window.innerWidth})
  }

  getProfileDetails = async () => {
    this.setState({isProfileLoading: true, isProfileApiGetError: false})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const rensponse = await fetch(url, options)
      const data = await rensponse.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileDetails: updatedData, isProfileLoading: false})
    } catch (error) {
      this.setState({isProfileApiGetError: true, isProfileLoading: false})
    }
  }

  getJobsList = async () => {
    const {
      selectedEmployeesTypeFilter,
      searchFilter,
      selectedSalaryRangeFilter,
    } = this.state
    this.setState({isJobsLoading: true, isJobsApiGetError: false})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${selectedEmployeesTypeFilter}&minimum_package=${selectedSalaryRangeFilter}&search=${searchFilter}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const rensponse = await fetch(url, options)
      const data = await rensponse.json()
      const updatedJobsList = data.jobs.map(jobs => ({
        id: jobs.id,
        title: jobs.title,
        rating: jobs.rating,
        location: jobs.location,
        companyLogoUrl: jobs.company_logo_url,
        employmentType: jobs.employment_type,
        jobDescription: jobs.job_description,
        packagePerAnnum: jobs.package_per_annum,
      }))
      this.setState({
        jobsList: updatedJobsList,
        isJobsLoading: false,
        isJobsApiGetError: false,
      })
    } catch (error) {
      this.setState({isJobsApiGetError: true, isJobsLoading: false})
    }
  }

  onEmploymentTypeClick = event => {
    this.setState(prevState => {
      if (prevState.selectedEmployeesTypeFilter.includes(event.target.value)) {
        const filteredList = prevState.selectedEmployeesTypeFilter.filter(
          each => each !== event.target.value,
        )
        return {
          selectedEmployeesTypeFilter: filteredList,
        }
      }
      return {
        selectedEmployeesTypeFilter: [
          ...prevState.selectedEmployeesTypeFilter,
          event.target.value,
        ],
      }
    }, this.getJobsList)
  }

  onSalaryRangeClick = event => {
    this.setState(
      {selectedSalaryRangeFilter: event.target.value},
      this.getJobsList,
    )
  }

  onSearchFilterChange = event => {
    this.setState({searchFilter: event.target.value})
  }

  onSearchIconClick = () => {
    this.getJobsList()
  }

  onProfileRetryClick = () => {
    this.getProfileDetails()
  }

  onJobsRetryClick = () => {
    this.getJobsList()
  }

  renderProfile = () => {
    const {profileDetails, isProfileLoading, isProfileApiGetError} = this.state
    if (isProfileLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    return isProfileApiGetError ? (
      <div className="user-profile-error-container">
        <button
          type="button"
          className="retry-button"
          onClick={this.onProfileRetryClick}
        >
          Retry
        </button>
      </div>
    ) : (
      <div className="user-profile-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-picture"
        />
        <h1 className="profile-name-text">{profileDetails.name}</h1>
        <p className="profile-role-text">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobsList, isJobsLoading, isJobsApiGetError} = this.state

    if (isJobsLoading) {
      return (
        <div className="jobs-loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (isJobsApiGetError) {
      return (
        <div className="jobs-api-failure-view-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-view-img"
          />
          <h1 className="jobs-failure-view-para">Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button
            type="button"
            className="jobs-api-failure-button"
            onClick={this.onJobsRetryClick}
          >
            Retry
          </button>
        </div>
      )
    }

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-view-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-para">No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul className="all-jobs-list-container">
        {jobsList.map(job => (
          <JobsItem key={job.id} jobDetails={job} />
        ))}
      </ul>
    )
  }

  renderEmploymentType = () => {
    const {employeeTypeDetails} = this.props
    const {selectedEmployeesTypeFilter} = this.state
    return (
      <>
        <hr />
        <div>
          <h1 className="filter-heading">Type of Employment</h1>
          <ul className="filters-container">
            {employeeTypeDetails.map(type => (
              <li key={type.employmentTypeId}>
                <input
                  id={type.employmentTypeId}
                  type="checkbox"
                  value={type.employmentTypeId}
                  className="checkbox-input"
                  onChange={this.onEmploymentTypeClick}
                  checked={selectedEmployeesTypeFilter.includes(
                    type.employmentTypeId,
                  )}
                />
                <label
                  htmlFor={type.employmentTypeId}
                  className="checkbox-label"
                >
                  {type.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr />
      </>
    )
  }

  renderSalaryRange = () => {
    const {salaryRangeDetails} = this.props
    const {selectedSalaryRangeFilter} = this.state
    return (
      <div>
        <h1 className="filter-heading">Salary Range</h1>
        <ul className="filters-container">
          {salaryRangeDetails.map(range => (
            <li key={range.salaryRangeId}>
              <input
                id={range.salaryRangeId}
                type="radio"
                value={range.salaryRangeId}
                className="radio-input"
                onChange={this.onSalaryRangeClick}
                checked={selectedSalaryRangeFilter === range.salaryRangeId}
              />
              <label htmlFor={range.salaryRangeId} className="radio-label">
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobsLgUI = () => (
    <div className="search-bar-jobs-container">
      <div className="search-bar-container">
        <input
          type="search"
          placeholder="Search"
          onChange={this.onSearchFilterChange}
          className="search-input"
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.onSearchIconClick}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
      <div className="jobs-lists-lg-container">{this.renderJobsList()}</div>
    </div>
  )

  render() {
    const {width} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <>
        <Header />
        <div className="jobs-page-container">
          <div className="profile-filters-container">
            {width >= 768 ? (
              <>
                {this.renderJobsLgUI()}
                <div className="profile-two-filters -container">
                  {this.renderProfile()}
                  {this.renderEmploymentType()}
                  {this.renderSalaryRange()}
                </div>
              </>
            ) : (
              <>
                <div className="profile-two-filters-container">
                  <div className="search-bar-container">
                    <input
                      type="search"
                      placeholder="Search"
                      onChange={this.onSearchFilterChange}
                      className="search-input"
                    />
                    <button
                      type="button"
                      data-testid="searchButton"
                      className="search-button"
                      onClick={this.onSearchIconClick}
                    >
                      <BsSearch className="search-icon" />
                    </button>
                  </div>
                  {this.renderProfile()}
                  {this.renderEmploymentType()}
                  {this.renderSalaryRange()}
                </div>
                {this.renderJobsList()}
              </>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
