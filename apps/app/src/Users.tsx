import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import { AuthContext } from './providers/app-providers';

/* 一个简单的登录表单, 明文传递了数据, 固定了登录地址
生产环境中应当使用redirect来实现后端登录(OAuth2.0)
*/
const Users = () => {
    const { accessToken } = useContext(AuthContext)
    const [users, setUsers] = useState([]);
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
    ];

    useEffect(() => {
        axios.get('https://api.dev.sapia.ai/users', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
            .then((response) => {
                const users = response.data.map((user: { _id: string, username: string }) => ({
                    key: user._id,
                    id: user._id,
                    username: user.username,
                }));
                setUsers(users);
            })
            .catch((error) => {
                console.error("Error fetching users", error);
            });
    }, [])


    return (
        <Table pagination={false} columns={columns} dataSource={users} />
    );
};

export default Users;
