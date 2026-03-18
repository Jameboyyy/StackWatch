import { useState,useEffect } from 'react'
import { getBackendService } from './services/api';
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect (() => {
    const fetchStatus = async () => {
      try {
        const data = await getBackendService();
        setMessage(data);
      } catch (error) {
        setMessage('Failed to connect to backend');
        console.error(error);
      }
    };
    fetchStatus(); 
  },[])

  return (
    <div>
      <h1>StackWatch</h1>
      <p>Backend says: {message}</p>
    </div>
  )
}

export default App
