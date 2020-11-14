import { Popover } from 'antd'
import React from 'react'
import './ContentPreview.css'

const ContentPreview = ({ content }) => {
  return (
    <Popover content={content} overlayClassName='email-content-preview'>
      {content.slice(0, 60).trim()}...
    </Popover>
  )
}

export default ContentPreview
