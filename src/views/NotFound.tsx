import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setActiveTab } from '@/store/tabSlice'
import '@/styles/NotFound.scss'

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const goHome = () => {
    navigate('/dashboard')
    dispatch(setActiveTab('/dashboard'))
  }

  return (
    <div className="not-found">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={
          <Button type="primary" onClick={goHome}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default NotFound
