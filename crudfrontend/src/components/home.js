import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';

export function Home() {
    const [username, setUserName] = useState('');
    const [taskDataList, setTaskDataList] = useState([]);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/view', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
                });
                setUserName(response.data);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, []);

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/tasks/', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
                });
                setTaskDataList(response.data);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTaskData();
    }, []);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8000/api/llmquery',
                { input: message },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
            const newChat = [...chatHistory, { type: 'user', message: message }];
            setChatHistory(newChat);
            setChatHistory([...newChat, { type: 'bot', message: response.data.message }]);
            const taskResponse = await axios.get('http://localhost:8000/api/users/tasks/', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
        });
        setTaskDataList(taskResponse.data);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false); // Set loading state to false when response received
            setMessage('');
        }

    };

    return (
        <div className="container">
            <h1 className="welcome-header">Welcome to the CRUD App, {username}!</h1>
            <p className="instructions">
            You can view your tasks here, query the chatbot to modify, update or delete your tasks. At the same time you can also go to the View tab to view all users and tasks.
             </p>
            <div className="task-details">
                <h2>Task Details:</h2>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Task ID</th>
                            <th>User</th>
                            <th>Due Date</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskDataList.map((taskData, index) => (
                            <tr key={index}>
                                <td>{taskData.taskname}</td>
                                <td>{taskData.taskid}</td>
                                <td>{taskData.user}</td>
                                <td>{new Date(taskData.due_date).toLocaleString()}</td>
                                <td>{taskData.priority}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="chatbot-container">
                <h2>Chatbot</h2>
                <div className="chatbot-messages">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={chat.type === 'user' ? 'user-message' : 'bot-message'}>
                            <Markdown>{chat.message}</Markdown>
                        </div>
                    ))}
                    {loading && (
                         <div className="bot-message">
                         <div className="dot-pulse"></div>
                     </div>
                    )}
                </div>
                <div className="chatbot-input">
                    <input
                        type="text"
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}
