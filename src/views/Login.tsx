import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox, message, Card } from 'antd'
import { UserOutlined, LockOutlined, VerifiedOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/login'
import { setTokenA, setTokenR } from '@/utils/token'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '@/store/userInfoSlice'
import { generateRoutes } from '@/router/dynamic'

const Login: React.FC = () => {
  const dispatch = useDispatch()

  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState('1234')

  const refreshCaptcha = () => {
    const newCaptcha = Math.floor(1000 + Math.random() * 9000).toString()
    setCaptcha(newCaptcha)
  }

  useEffect(() => {
    refreshCaptcha()

    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
      form.setFieldsValue({
        username: rememberedUser,
        remember: true,
      })
    }
  }, [form])

  const loginRules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 5, max: 15, message: '用户名长度为5-15个字符' },
    ],
    password: [
      { required: true, message: '请输入密码' },
      {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/,
        message: '密码需为6-18位，包含字母和数字',
      },
    ],
    captcha: [
      { required: true, message: '请输入验证码' },
      { pattern: /^\d{4}$/, message: '验证码为4位数字' },
    ],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (values: any) => {
    setLoading(true)
    try {
      const res = await login(values)
      if (!res.data.user.enabled) {
        message.warning('该用户已被禁用')
        setLoading(false)
        return
      }
      if (res.code === 200) {
        setLoading(false)
        if (values.remember) {
          localStorage.setItem('rememberedUser', values.username)
        } else {
          localStorage.removeItem('rememberedUser')
        }
        dispatch(setUserInfo(values))
        setTokenA(res.data.accessToken)
        setTokenR(res.data.refreshToken)
        message.success(res.message)
        await generateRoutes()
        navigate('/', { replace: true })
      } else {
        message.error(res.message)
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{ width: 500, borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
        title="权限系统登录"
      >
        <Form
          form={form}
          name="loginForm"
          initialValues={{ remember: false }}
          onFinish={handleLogin}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item label="用户名" name="username" rules={loginRules.username}>
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={loginRules.password}>
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          <Form.Item label="验证码" name="captcha" rules={loginRules.captcha}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                style={{ width: '81%', marginRight: 8 }}
                prefix={<VerifiedOutlined />}
                placeholder="请输入验证码"
                maxLength={4}
              />
              <Button onClick={refreshCaptcha}>{captcha}</Button>
            </div>
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ span: 24 }}>
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default Login
