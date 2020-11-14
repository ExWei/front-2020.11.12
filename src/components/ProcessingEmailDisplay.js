import { Empty } from 'antd'

const ProcessingEmailDisplay = ({ email }) => {
  return (
    <div>
      {
          email
            ? <div>
              <h2>{email.subject}</h2>
              <div className='email-content'>{email.body}</div>
            </div>
            : <Empty description='No new emails available' />
        }
    </div>
  )
}

export default ProcessingEmailDisplay
