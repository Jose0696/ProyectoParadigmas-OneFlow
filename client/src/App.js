import React, {useEffect, useState } from 'react'
import './App.css';
import Button from './componentes/boton';
import CodeEditor from './componentes/CodeEditor';


function App() {


  // Example using fetch from data in server
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch('/api')
    .then(response => response.json())
    .then(data => {
      setBackendData(data);
    });
  }, []);

/////////////////////////////////////////////////////////////////////////////

return (
  <div className="App">
    {typeof backendData.users === 'undefined' ? (
      <p>Loading data from server...</p>
    ) : (
      backendData.users.map((user, i) => (
        <p key={i}>{user}</p>
      ))
    )}
    <Button/>
    <CodeEditor></CodeEditor>
  </div>
);

}

export default App;
