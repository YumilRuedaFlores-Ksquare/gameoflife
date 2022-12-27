import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';


function Rules(){
  return (
    <div className="rules">
        <h2>Rules</h2>
        <ol>
          <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ol>
      </div>
  )
}

function App() {
  
  const [gridCurrent, setGrid] = useState(new Array());  
  const [generation, setGeneration] = useState(0);
  const canvasRef = React.useRef(null);

  const [stop, setStop] = useState(true);
  const [buttonName, setButtonName] = useState('Start');
  const [initGrid_, setinitGrid] = useState(null);
  const [size, setSize] = useState(10);
  
  const GRID_WIDTH =  600;             
  const GRID_HEIGHT = 600;       
  const [RES, setRes]= useState(10);
  const [COL, setCol]= useState(GRID_WIDTH / RES);
  const [ROW, setRow]= useState(GRID_HEIGHT / RES);

  const [mousePos, setMousePos] = useState({});

  // let RES = 60;
  // let COL = GRID_WIDTH / RES;    
  // let ROW = GRID_HEIGHT / RES;  
  const createGrid = function(empty){
    let grid = [];
    
    for(let x = 0; x < COL; x++){
      let nest = [];
      for(let y = 0; y < ROW; y++){
  
        let num = empty==false? Math.floor(Math.random() * (2)):0;
        nest.push(num);
      }
      grid.push(nest);
    }
  
    return grid;
  };

  function RestartGrid(empty){
    setGrid(createGrid(true));
  }
  
  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, COL, ROW);
    console.log(COL, ROW,RES);
    for (let i = 0; i < COL; i++) {
      for (let j = 0; j < ROW; j++) {
        const cell = gridCurrent[i][j];
        //Add color depending it is alive
        ctx.fillStyle = cell ? "#000000" : "#ffffff";
        //draw the cubes
        ctx.fillRect(i * RES, j * RES, RES, RES);
        //draw my cells
        ctx.fillStyle ="#000000";
        ctx.fillRect((i * RES) , (j * 5), 2, GRID_WIDTH);
        ctx.fillStyle ="#000000";
        ctx.fillRect((i * 5) , (j * RES), GRID_HEIGHT, 2);
      }
    } 
  }
  function check(x,y){
    //outsite the limits = 0
    if(x < 0 || x >= COL|| y < 0 || y >= ROW){
      return 0;
    }
    //if tha actual position its alavie = 1, else = 0
    let val = gridCurrent[x][y]==1?1:0;
    return val;
  }
  

  function gridAlive(){
    let gridAlive = createGrid(true);
    let numAlive = 0;
    for (let x = 0; x < COL; x++) {
        for (let y = 0; y < ROW; y++) {
            // Count ofpopulation
            numAlive = check(x - 1, y - 1) + check(x, y - 1) + check(x + 1, y - 1) + check(x - 1, y) + check(x + 1, y) + check(x - 1, y + 1) + check(x, y + 1) + check(x + 1, y + 1);
            gridAlive[x][y] = numAlive;
        }
    }
    return gridAlive;
  };  

  
  function rules(){
    let newGrid = createGrid(true);
    // Game Logic
    let gridPopullation = gridAlive();
    //Here the rules...
    for(let i = 0;i<COL;i++){
      for(let j = 0;j<COL;j++){

        //Grid with the qty of alives around the position x,y
        let cellPopulation = gridPopullation[i][j];
        //Current Status
        let cellStatus = gridCurrent[i][j];
        //Rules:
        if(cellStatus == 1){
          let chase = cellPopulation >3?1:(cellPopulation<2?1:cellPopulation);
          switch (chase) {
            case 1:
              newGrid[i][j] = 0;
              break;
            case 2:
              newGrid[i][j] = 1;
              break;
            case 3:
              newGrid[i][j] = 1;
              break;
            default:
              newGrid[i][j] = 0;
          }
        }else{
          switch (cellPopulation) {
            case 3:
              newGrid[i][j] = 1;
              break;
            default:
              newGrid[i][j] = 0;
          }
        }
      }
    }
    setGrid(newGrid);
  }
  function updateGeneration(){
    setGeneration(prev => prev + 1);
  }
  function handleOnClick(e){
    const newLocation = { x: e.clientX, y: e.clientY };
    
    const localX = e.clientX - e.target.offsetLeft - Math.trunc(window.scrollX);
    const localY = e.clientY - e.target.offsetTop +  Math.trunc(window.scrollY); 

    // console.log(localX,localY)
    // console.log(newLocation.x,newLocation.y);
    // console.log(window.scrollX);

    let newGrid = gridCurrent;
    let Pos_X = Math.trunc(localX/RES) ;
    let Pos_Y = Math.trunc(localY/RES) ;
    newGrid[Pos_X][Pos_Y] = newGrid[Pos_X][Pos_Y] ? 0 : 1;
    setGrid(newGrid);
    //console.log(gridCurrent)
    draw();
  }
  if(generation === 0){
    RestartGrid(true);
    updateGeneration();
  }
  
  useEffect(() => {
    
    draw();

    if(!stop){
      setButtonName('STOP');
      const timer = setTimeout(() => {
        rules();
        updateGeneration();
      }, 500);
      return () => clearTimeout(timer);
    }else{
      setButtonName('START');
    }

  }, [draw, updateGeneration,rules, setButtonName]);





  return (
    <div className="App">
      <header className="App-header">
        <h1 className='title' >CONWAY'S GAME OF LIFE</h1>
        <p className='instruction'> Cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves.</p>
      </header>

      <main>
        <Rules></Rules>
      <div className="grid">
        <canvas id="board"
          ref={canvasRef}
          width={GRID_WIDTH}
          height={GRID_HEIGHT}
          onClick={handleOnClick}
        />

        <p className="generationNo">Generation No: {generation}</p>
        <input id="quantity" type="range" min="10" max="50" step="10" defaultValue={10} onChange={(e)=>{
            //Update values
            setSize(e.target.value);
            setRes(600/e.target.value);
            console.log(e.target.value);
            setCol(GRID_WIDTH / RES);    
            setRow(GRID_HEIGHT / RES);
            RestartGrid();
        }}/>
        <h2>Size: {size}</h2>
      </div>

      <div className="panel">
        <nav>
          <button type="button" className="reset" onClick={()=>{
            setGrid(initGrid_);
          }}>RESET</button>
          <button type="button" className='start' onClick={()=>{

            setStop(prev=>!prev);
            console.log(gridCurrent)
          }}>{buttonName}</button>
          <button type="button" className="randomize" onClick={()=>{
            RestartGrid(false);
          }}>RANDOMIZE</button>
          <button type="button" className="clear" onClick={()=>{
            RestartGrid(true);
          }}>CLEAR</button>
        </nav>
      </div>

    </main>

    </div>
  );
}


export default App;
