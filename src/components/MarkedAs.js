import { Tag } from 'antd'
import React from 'react'

const MarkedAs = ({ status }) => {
  const statusToColorMap = {
    positive: '#87d068',
    neutral: 'gray',
    not_lead: 'red',
    pending: 'purple'
  }
  const statusToTextMap = {
    positive: 'POSITIVE',
    neutral: 'NEUTRAL',
    not_lead: 'NOT A LEAD',
    pending: 'PENDING'
  }

  return (
    <Tag color={statusToColorMap[status]} key={status}>
      {statusToTextMap[status]}
    </Tag>
  )
}

export default MarkedAs
