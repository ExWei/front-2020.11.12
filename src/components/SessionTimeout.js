import { Modal } from 'antd'
import '../containers/Processing.css'

const SessionTimeout = ({ expired }) => {
  const handleAction = () => {
    location.reload()
  }

  return (
    <Modal
      title='Session expired'
      visible={expired}
      onOk={handleAction}
      onCancel={handleAction}
      closable={false}
    >
      <p>Page will be refreshed because the session has expired</p>
    </Modal>
  )
}

export default SessionTimeout
