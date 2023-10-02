import React, { useEffect, useState } from 'react';
import TextAreaWithLineCounter from  './textAreas/textArea';
import { API_SERVER_URL } from './Url';


let keywords = []; // Stores relevant keywords from the code

// Functional component, which accept a series of properties as unsctructured arguments
const CodeEditor = ({codeData, setCode, outputData, setConsoleOutput, inputData, handleChangeInput, ConsoleData, wordCount, setWordCount, wordCountOutput,lineCountOutput}) => {


  //The keyword array is updated with the keywords obtained from the server
  //executed only once after assembling the component
  useEffect(() => {
    fetch(`${API_SERVER_URL}/keywords`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener las palabras clave");
        }
        return response.json();
      })
      .then((data) => {
        keywords = data.palabrasReservadas; // Set keywords array with info returned by fetch from api
      })
      .catch((error) => {
        console.error(error);
      });
    }, []);


    //A state is declared to store keywords that match those written by the user
   
  const [matching_keywords, setMatching_keywords] = useState([]);  
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });


  //we use to autocomplete keywords in the code editor.
// If a keyword matches, its added to the code.
  const autoComplete = (word) => {

    console.log(word)
    const filteredWords = keywords.filter((keyword) => keyword.includes(word));

    if (filteredWords.length > 0) {
      const newCode = eliminarUltimaPalabra(codeData) + " "+ filteredWords[0];
      setCode(newCode);
      setMatching_keywords([])
    }
  };


  //These functions are used to get the last word from a text 
  //string and remove the last word from a text string.
  function obtenerUltimaPalabra(texto) {

    if(texto[texto.length-1] != ' '){
    const palabras = texto.split(' ');
    return palabras.length >= 2 ? palabras[palabras.length - 1] : texto;
    }
    return ' '
  }

  const eliminarUltimaPalabra = (texto) => {
    const palabras = texto.split(' ');
    return palabras.length >= 2 ? palabras.slice(0, -1).join(' ') : '';
  };


  //This function is called when the content of the code editor is changed. 
  //Updates the status with the new code,
   //counts the lines and words of the code, and searches for 
   //matching keywords for autocomplete.
  const handleChange = ({ target: { value, selectionStart } }) => {
    setCode(value);

    const inputWord = obtenerUltimaPalabra(value) 

    // count words, lines, columns
    const words = value.split(/\s+/).filter((word) => word !== '').length;

    const lines = value.substr(0, selectionStart).split('\n');
    const line = lines.length;
    const column = lines.pop().length + 1;

    // Update cursor position
    setCursorPosition({ line, column });
    setWordCount({target : {value : words}});
    if (inputWord === "") {
      setMatching_keywords([]);
    } else {
      const matches = keywords.filter((word) => word.startsWith(inputWord));
      setMatching_keywords(matches);
    }

  };

  const handleClick = ({ target: { value, selectionStart } }) => {
    const lines = value.substr(0, selectionStart).split('\n');
    const line = lines.length;
    const column = lines.pop().length + 1;
  
    // Update position when click
    setCursorPosition({ line, column });
  };


  
  const handleKeyDown = ({ keyCode }) => {

    // keyCodeLeft (37) & KeyCodeRight (39)
    if (keyCode === 37 && cursorPosition.column > 1) {
      // Move left
      setCursorPosition({
        ...cursorPosition,
        column: cursorPosition.column - 1,
      });
    } else if (keyCode === 39) {
      // Move right
      setCursorPosition({
        ...cursorPosition,
        column: cursorPosition.column + 1,
      });
    }

  };


  return (
    <>
    
      {/*This section displays a text entry field used to upload or save files.*/}
      {/*The onChange attributes are bound to the handleChangeInput function, 
      which means that when the user types in this field,
        the handleChangeInput function will be called to handle the changes. 
        The input field value is set to inputData*/}
      <div>
        <input
          type="text"
          placeholder="Guardar o Cargar archivo"
          style={{ width: '350px', display: 'block'}}
          onChange={handleChangeInput}
          value={inputData}
        />
      </div>
     
        {/*In this section, buttons are displayed that represent keywords that match the user's input. 
        These buttons are generated by assigning the match_keywords array.*/}
      <div style={{height: '40px', width: '1100px'}}>
          <div>
            {matching_keywords.map((word) => (
              <button onClick={() => autoComplete(word)} key={word}>
                {word}
              </button>
            ))}
          </div>
      </div>

    {/*Textarea EA and TA*/}
      {/*Displays text (either code or output data) and are connected to the handleChange or setConsoleOutput functions as needed. Additionally,
       the number of lines and words in each corresponding text area is displayed.*/}
    <div style={{ display: 'flex'}}>
      <div style={{paddingRight: '10px'}}>
      <TextAreaWithLineCounter text={codeData} setText={handleChange} boolRead ={false} clickFunction = {handleClick} keyDown = {handleKeyDown}/>
          <div style={{ paddingLeft: '15px' }}>
            Línea {cursorPosition.line}, Columna {cursorPosition.column} Palabras: {wordCount}
          </div>
      </div>

      <div>
      <TextAreaWithLineCounter text={outputData} setText={setConsoleOutput} boolRead ={true}  clickFunction = {handleClick} />
        <div style={{paddingLeft: '15px'}}>
            Líneas: {lineCountOutput} Palabras: {wordCountOutput}
        </div>
      </div>
    </div>
   
    <div>
       {/*This is the text area RA*/}
        {/*Here is shown a read-only text area containing ConsoleData*/}
      <textarea
        value={ConsoleData}
        readOnly
        style={{
          width: '1100px',
          height: '150px',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '10px',
          boxSizing: 'border-box',
          overflowX: 'scroll',
          marginTop: '20px',
          color : 'green',
          background : 'black'
        }}
      />
    </div>
    </>
  );
}

export default CodeEditor;