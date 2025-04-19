import {Switch, Route, Redirect} from 'react-router-dom'
import './App.css'
import Login from './Components/Login/index'
import Home from './Components/Home/index'
import Jobs from './Components/Jobs/index'
import JobsItemDetails from './Components/JobItemDetails/index'
import NotFound from './Components/NotFound/index'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const App = () => (
  <>
    <Switch>
      <Route path="/login" component={Login} />
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/jobs"
        render={props => (
          <Jobs
            {...props}
            employeeTypeDetails={employmentTypesList}
            salaryRangeDetails={salaryRangesList}
          />
        )}
      />
      <Route exact path="/jobs/:id" component={JobsItemDetails} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </>
)

export default App
