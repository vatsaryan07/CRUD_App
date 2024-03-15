import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';

export function View() {
    const [taskDataList, setTaskDataList] = useState([]);

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                console.log(axios.defaults.headers.common['Authorization'])
                const response = await axios.get('http://localhost:8000/api/users/tasks/',{headers: {Authorization:'Bearer '+localStorage.getItem('access_token')}});
                setTaskDataList(response.data);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTaskData();
    }, []);

    const [userDataList, setUserDataList] = useState([]); // Initialize state to store user data list

    useEffect(() => {
        // Define an async function to fetch user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/');
                setUserDataList(response.data); // Update state with user data list
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData(); // Call the async function when component mounts
    }, []); // Empty dependency array ensures this effect runs only once on mount
    return(
        <>
            <div className="container">
                <h1>User Details:</h1>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>ID</th>
                            <th>Tasks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userDataList.map((userData, index) => (
                            <tr key={index}>
                                <td>{userData.first_name} {userData.last_name}</td>
                                <td>{userData.email}</td>
                                <td>{userData.id}</td>
                                <td>
                                    <ul>
                                        {userData.tasks.map((task, taskIndex) => (
                                            <li key={taskIndex}>
                                                <strong>Task Name:</strong> {task.taskname}<br />
                                                <strong>Task ID:</strong> {task.taskid}<br />
                                                <strong>Due Date:</strong> {task.due_date}<br />
                                                <strong>Priority:</strong> {task.priority}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="container">
                <h1>Task Details:</h1>
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
            </>
    )

}