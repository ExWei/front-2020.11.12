import React, { useEffect, useState } from 'react'
import { Col, Row, Space, Table } from 'antd'
import { Auth } from 'aws-amplify'
import moment from 'moment'
import MarkedAs from '../components/MarkedAs'
import ContentPreview from '../components/ContentPreview'
import config from '../config'

const Admin = () => {
  const [emails, setEmails] = useState([])

  const columns = [
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
      render: body => <ContentPreview content={body} />
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: status => <MarkedAs status={status} />
    },
    {
      title: 'Processed At',
      key: 'processedAt',
      dataIndex: 'processedAt',
      render: processedAt => <div>{processedAt ? moment(new Date(processedAt)).format('YYYY-MM-DD hh:mm:ss a'): ''}</div>
    },
    {
      title: 'Processed By',
      key: 'processedBy',
      dataIndex: 'processedBy',
      render: processedBy => <div>{processedBy}</div>
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <a onClick={() => changeStatus(record.id, 'positive')}>Positive</a>
          <a onClick={() => changeStatus(record.id, 'neutral')}>Neutral</a>
          <a onClick={() => changeStatus(record.id, 'not_lead')}>Not a Lead</a>
          <a onClick={() => changeStatus(record.id, 'pending')}>Back to the pool</a>
        </Space>
      )
    }
  ]

  const loadEmails = async () => {
    const currentSession = await Auth.currentSession()

    const emails = await fetch(`${config.API_URL}/emails/admin`, {
      headers: {
        'Access-Token': currentSession.getAccessToken().getJwtToken()
      }
    })
    setEmails(await emails.json())
  }

  const changeStatus = async (id, status) => {
    const currentSession = await Auth.currentSession()

    await fetch(`${config.API_URL}/emails/${id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': currentSession.getAccessToken().getJwtToken()
      },
      body: JSON.stringify({ status })
    })
    await loadEmails()
  }

  useEffect(loadEmails, [])

  return (
    <div>
      <Row>
        <Col span={24}>
          <Table columns={columns} dataSource={emails} rowKey='id' />
        </Col>
      </Row>
    </div>
  )
}

export default Admin
