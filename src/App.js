import { Redirect, Route, Switch } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import 'antd/dist/antd.css'
import './App.css'
import { Layout } from 'antd'

import Home from './containers/Home'
import Processing from './containers/Processing'
import Admin from './containers/Admin'
import { useEffect, useState } from 'react'

const { Content } = Layout

function App () {
  return (
    <Layout className='layout'>
      <Content style={{ padding: '50px' }}>
        <div className='site-layout-content'>
          <Switch>
            <UnauthRoute exact path='/'><Home /></UnauthRoute>
            <PrivateRoute exact path='/processing'><Processing /></PrivateRoute>
            <PrivateRoute exact path='/admin' adminOnly><Admin /></PrivateRoute>
          </Switch>
        </div>
      </Content>
    </Layout>
  )
}

function UnauthRoute ({ children, ...rest }) {
  const [auth, setAuth] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  useEffect(() => {
    async function checkAuth () {
      try {
        const currentSession = await Auth.currentSession()
        setAuth(currentSession)
      } catch (e) {
      }
      setAuthLoading(false)
    }

    checkAuth()
  }, [])

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !authLoading
          ? !auth
              ? (children) : (
                <Redirect
                  to={{
                    pathname: '/processing',
                    state: { from: location }
                  }}
                />
                ) : null}
    />
  )
}

function PrivateRoute ({ children, ...rest }) {
  const [auth, setAuth] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    async function checkAuth () {
      try {
        const currentSession = await Auth.currentSession()
        const user = await Auth.currentAuthenticatedUser()
        const groups = user.signInUserSession.accessToken.payload['cognito:groups']
        if (groups && groups.includes('admins')) {
          setIsAdmin(true)
        }
        setAuth(currentSession)
      } catch (e) {
      }
      setAuthLoading(false)
    }

    checkAuth()
  }, [])

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !authLoading
          ? (auth && (!rest.adminOnly || (rest.adminOnly === true && isAdmin)))
              ? (children) : (
                <Redirect
                  to={{
                    pathname: '/',
                    state: { from: location }
                  }}
                />
                ) : null}
    />
  )
}

export default App
