import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import md5 from 'md5';

/* 一个简单的登录表单, 明文传递了数据, 固定了登录地址
生产环境中应当使用redirect来实现后端登录(OAuth2.0)
*/
const Login = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async ({ username, password }: { username: string, password: string }) => {
        setLoading(true);
        try {
            const values = { username, password: md5(password) };
            const response = await axios.post('https://api.dev.sapia.ai/auth/login', values);
            const token = response.data.token;
            // 在这里可以将 token 存储到本地存储或者cookie中，以便以后的请求使用
            if (!token) {
                throw new Error('登录失败');
            }
            message.success('登录成功');
        } catch (error) {
            message.error("登录失败");
        }
        setLoading(false);
    };

    return (
        <Form name="login-form" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
            >
                <Input placeholder="账号" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password placeholder="密码" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;