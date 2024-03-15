import axios from 'axios';
import { useState, useEffect } from 'react'; // Import useState and useEffect


export function Home(){
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
    }, []); // Empty dependency array ensures this effect runs only once on moun

    const [username,setUserName] = useState([])
    useEffect(() => {
        // Define an async function to fetch user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/view',{headers: {Authorization:'Bearer '+localStorage.getItem('access_token')}});
                setUserName(response.data); // Update state with user data list
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData(); // Call the async function when component mounts
    }, []);

    const [message, setMessage] = useState('');
    const [botResponse, setBotResponse] = useState('');

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/llmquery',
                { input: message },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
            console.log(response)
            setBotResponse(response.data['message']); // Update state with bot's response
            console.log(botResponse)
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error here, such as displaying an error message to the user
        }
    };

    return(
        <><div className="container">
            <h1> Hi {username}</h1>
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
        </div><div className="container">
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
            <div className="container">
                <h1>Chatbot</h1>
                <div className="chatbot-container">
                    <div className="chatbot-messages">
                        {botResponse && <div className="bot-message">{botResponse}</div>}
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
            
            </>
    )
    
}