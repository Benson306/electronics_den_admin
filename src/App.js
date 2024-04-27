import React, { lazy, useContext } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import { AuthContext, AuthProvider } from './context/AuthContext'

const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

function App() {

  const { authUser } = useContext(AuthContext);

  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />

          {/* Place new routes over this */}
          <Route path="/app" component={ authUser == null ? Login : Layout} />
          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/app" />
        </Switch>
      </Router>
    </>
  )
}

export default App
