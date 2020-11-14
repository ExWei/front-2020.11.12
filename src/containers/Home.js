import { Form, Input, Button } from 'antd'
import { Auth } from 'aws-amplify'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const layout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 8
    }
  }
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16
    }
  }

  const history = useHistory()

  const onFinish = async ({ username, password }) => {
    try {
      const loginObject = await Auth.signIn(username, password)
      if (loginObject.challengeName === 'NEW_PASSWORD_REQUIRED') {
        await Auth.completeNewPassword(loginObject, prompt('New password required, cant be the same as the current password'))
      }
      history.push('/processing')
    } catch (e) {
      console.error(e.message)
    }
  }

  return (
    <div>
      <Form
        {...layout}
        name='basic'
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[
            {
              required: true,
              message: 'Please input your username!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Home
