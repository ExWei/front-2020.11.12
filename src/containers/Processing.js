import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Row, Divider, Skeleton, Select, Empty } from 'antd'
import { useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import './Processing.css'
import SessionTimeout from '../components/SessionTimeout'
import ProcessingEmailDisplay from '../components/ProcessingEmailDisplay'
import config from '../config'

const Processing = () => {
  const [userStatus, setUserStatus] = useState(null)
  const [email, setEmail] = useState(null)
  const [expired, setExpired] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(null)
  const [emailLoading, setEmailLoading] = useState(true)
  const processingTimeout = useRef(null)
  const history = useHistory()

  const loadEmail = async () => {
    clearProcessingTimeout()
    setEmailLoading(true)
    const currentSession = await Auth.currentSession()
    const newEmail = await fetch(`${config.API_URL}/emails/processing`, {
      headers: {
        'Access-Token': currentSession.getAccessToken().getJwtToken()
      }
    })
    const newEmailData = await newEmail.json()
    setEmail(newEmailData)
    setEmailLoading(false)
    if (newEmailData) {
      const timeRemaining = (newEmailData.lastAssignedAt + 120000) - Date.now()
      processingTimeout.current = setTimeout(() => {
        setExpired(true)
      }, timeRemaining)
    }
  }

  const resolveEmail = async (status) => {
    setButtonLoading(status)
    const currentSession = await Auth.currentSession()
    await fetch(`${config.API_URL}/emails/${email.id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': currentSession.getAccessToken().getJwtToken()
      },
      body: JSON.stringify({ status })
    })
    setButtonLoading(null)
    await loadEmail()
  }

  const updateUserStatus = async (status) => {
    localStorage.setItem('userStatus', status)
    setUserStatus(status)
    if (status === 'Away' && email) {
      const currentSession = await Auth.currentSession()
      fetch(`${config.API_URL}/set-me-as-away`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': currentSession.getAccessToken().getJwtToken()
        },
        body: JSON.stringify({ emailId: email.id })
      })
      setEmail(null)
      clearProcessingTimeout()
    }
    if (status === 'Available' && !email && !emailLoading) {
      loadEmail()
    }
  }

  const clearProcessingTimeout = () => {
    if (processingTimeout) {
      clearTimeout(processingTimeout.current)
    }
  }

  const logout = async () => {
    await Auth.signOut()
    history.push('/')
  }

  useEffect(() => {
    updateUserStatus(localStorage.getItem('userStatus') || 'Available')
    loadEmail()

    return clearProcessingTimeout
  }, [])
  return (
    <div>
      <SessionTimeout expired={expired} />
      <Row>
        <Col span={20}>
          <Button type='primary' loading={buttonLoading === 'positive'} disabled={emailLoading || !!buttonLoading || !email} onClick={() => resolveEmail('positive')}>Positive</Button>
          <Button type='primary' ghost loading={buttonLoading === 'neutral'} disabled={emailLoading || !!buttonLoading || !email} onClick={() => resolveEmail('neutral')}>Neutral</Button>
          <Button type='primary' danger loading={buttonLoading === 'not_lead'} disabled={emailLoading || !!buttonLoading || !email} onClick={() => resolveEmail('not_lead')}>Not a lead</Button>
        </Col>
        <Col span={4}>
          <Button type='primary' danger onClick={logout} style={{ float: 'right', marginLeft: '15px' }}>Logout</Button>
          <Select value={userStatus} onChange={updateUserStatus} style={{ width: 120, float: 'right' }}>
            <Select.Option value='Available'>Available</Select.Option>
            <Select.Option value='Away'>Away</Select.Option>
          </Select>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          {
                        userStatus === 'Available'
                          ? !emailLoading
                              ? <ProcessingEmailDisplay email={email} />
                              : <Skeleton active />
                          : <Empty description='Change your status to Available to start processing emails' />
                    }
        </Col>
      </Row>
    </div>
  )
}

export default Processing
