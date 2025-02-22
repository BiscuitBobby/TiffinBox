import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css'


function App() {
  const [greeting, setGreeting] = useState('');
  async function handleClick() {
    try {
      // Invoke the Rust function
      const response = await invoke('greet', { name: 'User' });
      setGreeting(response);
    } catch (error) {
      console.error('Error calling Rust function:', error);
    }
  }

  return (
    
    <div className="container">
    <h1>Tauri + React</h1>
    <button onClick={handleClick}>
      Call Rust Function
    </button>
    <div>
    {greeting}
    </div>
  </div>

  )
}

export default App
