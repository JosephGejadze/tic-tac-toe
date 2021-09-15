import React from 'react';
import './App.css';

interface WinObj {
  [propName: string]: any;
}

type hwInput = {
  target: {value: string};
}

export class App extends React.Component{
  inputs: string[][];
  winnerObject: WinObj;
  state: {gridHeight: number, gridWidth: number, clickCount: number, gridsToWin: number; gameOn: boolean};
  constructor(props: any){
    super(props);
    this.inputs = this.resetGridInputs(3, 3);
    this.winnerObject = {};
    this.state = {gridHeight: 3, gridWidth: 3, clickCount: 0, gridsToWin: 3, gameOn: true};
  }

  handleHeightInput = (e: hwInput) => {
    let inputValue = parseInt(e.target.value);
    if(inputValue >= 3 && inputValue <= 15){
      this.inputs = this.resetGridInputs(inputValue, this.state.gridWidth);
      this.setState({gridHeight: inputValue, clickCount: 0});
    } else{
      this.inputs = this.resetGridInputs(3, this.state.gridWidth);
      this.setState({gridHeight: 3, clickCount: 0});
    }
  }
  
  handleWidthInput = (e: hwInput) => {
    let inputValue = parseInt(e.target.value);
    if(inputValue >= 3 && inputValue <= 15){
      this.inputs = this.resetGridInputs(this.state.gridHeight, inputValue);
      this.setState({gridWidth: inputValue, clickCount: 0});
    } else{
      this.inputs = this.resetGridInputs(this.state.gridHeight, 3);
      this.setState({gridWidth: 3, clickCount: 0});
    }
  }

  handleGridsToWinInput = (e: hwInput) => {
    let inputValue = parseInt(e.target.value);
    if(inputValue >= 3 && inputValue <= this.state.gridWidth && inputValue <= this.state.gridHeight){
      this.setState({gridsToWin: inputValue});
    } else{
      this.setState({gridsToWin: 3});
    }
  }

  handleSingleGridClick = (row: number, column: number) => {
    if(this.state.gameOn){
      if(this.inputs[row][column]===" "){
        this.inputs[row][column] = (this.state.clickCount%2)? 'O' : 'X';
        this.setState({clickCount: this.state.clickCount+1})
      }
      this.checkWin(row, column);
    }
  }

  resetGridInputs = (height: number, width: number) => {
    let RA = [] as string[][];
    for(let i=0; i<height; i++){
      RA.push([]);
      for(let j=0; j<width; j++){
        (RA[i]).push(" ");
      }
    }
    return RA;
  }

  resetGame = () => {
    this.inputs = this.resetGridInputs(this.state.gridHeight, this.state.gridWidth);
    this.winnerObject = {};
    this.setState({gameOn: true, clickCount: 0});
  }

  checkWin = (row: number, column: number) => {
    let win = false;
    let counter = 1;
    
    //check vertical
    if(!win){
      this.winnerObject={};
      for(let i=row-this.state.gridsToWin+1; i<=row; i++){
        if(i<0) continue;
        counter=1;
        for(let j=i; j<i+this.state.gridsToWin; j++){
          if(j >= this.state.gridHeight-1) break;
          if(this.inputs[j][column]===this.inputs[j+1][column] && this.inputs[j][column]===this.inputs[row][column]){
            ++counter;
            this.winnerObject[(j*this.state.gridWidth + column).toString()] = true;
          } else{
            counter=1;
            this.winnerObject={};
          }
          if(counter >= this.state.gridsToWin){
            this.winnerObject[((j+1)*this.state.gridWidth + column).toString()] = true;
            win=true;
            break;
          }
        }
        if(win) break;
      }
    }

    //check horizontal
    if(!win){
      this.winnerObject={};
      for(let i=column-this.state.gridsToWin+1; i<=column; i++){
        if(i<0) continue;
        counter=1;
        for(let j=i; j<i+this.state.gridsToWin; j++){
          if(j >= this.state.gridHeight-1) break;
          if(this.inputs[row][j]===this.inputs[row][j+1] && this.inputs[row][j]===this.inputs[row][column]){
            ++counter;
            this.winnerObject[(row*this.state.gridWidth + j).toString()] = true;
          } else{
            counter=1;
            this.winnerObject = {};
          }
          if(counter>=this.state.gridsToWin){
            this.winnerObject[(row*this.state.gridWidth + j + 1).toString()] = true;
            win=true;
            break
          }
        }
      if(win) break;
      }
    }

    //check LR diagonal
    if(!win){
      this.winnerObject={};
      counter=1;
      let j = 1 + column - this.state.gridsToWin;
      for(let i=row-this.state.gridsToWin+1; i<=row+this.state.gridsToWin-1; i++){
        if(i<0 || j<0){
          j++;
          continue;
        }
        if(j >= this.state.gridWidth-1 || i >= this.state.gridHeight-1) break;
        if((this.inputs[i][j]===this.inputs[i+1][j+1]) && (this.inputs[i][j]===this.inputs[row][column])){
          ++counter;
          this.winnerObject[(i*this.state.gridWidth + j).toString()] = true;
        } else{
          counter=1;
          this.winnerObject = {};
        }
        if(counter >= this.state.gridsToWin){
          this.winnerObject[((i+1)*this.state.gridWidth + j + 1).toString()] = true;
          win=true;
          break;
        }
        j++;
      }
    }

    //check RL diagonal
    if(!win){
      this.winnerObject={};
      counter=1;
      let j = column + this.state.gridsToWin - 1;
      for(let i=row-this.state.gridsToWin+1; i<=row+this.state.gridsToWin-1; i++){
        while(i<0){
          i++;
          j--;
        }
        if(j<=0 || i>=this.state.gridHeight-1){
          break;
        }
        if((this.inputs[i][j]===this.inputs[i+1][j-1]) && (this.inputs[i][j]===this.inputs[row][column])){
          ++counter;
          this.winnerObject[(i*this.state.gridWidth + j).toString()] = true;
        } else{
          counter=1;
          this.winnerObject = {};
        }
        if(counter >= this.state.gridsToWin){
          this.winnerObject[((i+1)*this.state.gridWidth + j - 1).toString()] = true;
          win=true;
          break;
        }
        j--;
      }
    }

    if(!win) this.winnerObject = {};

    if(win){
      console.log(this.winnerObject);
      alert(`And the winner is ${this.inputs[row][column]}`);
      this.setState({gameOn: false});
    }
  }

  render(){
    return <DisplayGame gridHeight={this.state.gridHeight} gridWidth={this.state.gridWidth} 
    handleHeightInput={this.handleHeightInput} handleWidthInput={this.handleWidthInput} inputs={this.inputs}
    handleSingleGridClick={this.handleSingleGridClick} handleGridsToWinInput={this.handleGridsToWinInput} resetGame={this.resetGame}
    winnerObject={this.winnerObject}/>
  }
}

type DisplayGameProps = {
  gridHeight: number;
  gridWidth: number;
  handleHeightInput: (e: hwInput)=>void;
  handleWidthInput: (e: hwInput)=>void;
  inputs: string[][];
  handleSingleGridClick: (a: number, b: number) => void;
  handleGridsToWinInput: (e: hwInput)=>void;
  resetGame: ()=>void;
  winnerObject: WinObj;
}


const DisplayGame = (props: DisplayGameProps) => {
  return(
    <div className="GameDiv">
      <h1>Tic Tac Toe</h1>
      <div className="CompleteGrid">
        <CompleteGrid gridWidth={props.gridWidth} gridHeight={props.gridHeight} inputs={props.inputs} handleSingleGridClick={props.handleSingleGridClick} 
        winnerObject={props.winnerObject}/>
      </div>  
      <div className="InputDiv">
        <div className="InputSubDiv">
          <span className="InputHeader Height">Height</span>
          <input className="InputBar Height" onChange={props.handleHeightInput}/>
        </div>
        <div className="InputSubDiv">
          <span className="InputHeader Width">Width</span>
          <input className="InputBar Width" onChange={props.handleWidthInput} />
        </div>
        <div className="InputSubDiv">
          <span className="InputHeader GridToWinSpan">Grids to win</span>
          <input className="InputBar GridToWinInput" onChange={props.handleGridsToWinInput}/>
        </div>
        <button className="RestartButton" onClick={props.resetGame} >Restart</button>
      </div>
    </div>
  );
}

type CompleteGridProps = {
  gridWidth: number;
  gridHeight: number;
  inputs: string[][];
  handleSingleGridClick: (a: number, b: number) => void;
  winnerObject: WinObj;
}

const CompleteGrid = (props: CompleteGridProps) => {
  let result = [];
  for(let i=0; i<props.gridHeight; i++){
    console.log(`row ${i}`);
    console.log(props.inputs[i]);
    result.push(<SingleRow gridWidth={props.gridWidth} inputs={props.inputs[i]} rowIndex={i} handleSingleGridClick={props.handleSingleGridClick}
    winnerObject={props.winnerObject}/>)
  }
  return(
    <div className="GridDiv">
      {result}
    </div>
  );
}

type SingleRowProps = {
  gridWidth: number;
  inputs: string[];
  rowIndex: number;
  handleSingleGridClick: (a: number, b: number) => void;
  winnerObject: WinObj;
}

const SingleRow = React.memo((props: SingleRowProps) => {
  let result = [];
  let isWinner = false;
  for(let i=0; i<props.gridWidth; i++){
    isWinner = (props.winnerObject[(props.rowIndex*props.gridWidth+i).toString()]===true)? true : false;
    result.push(<SingleGrid input={props.inputs[i]} rowIndex={props.rowIndex} columnIndex={i} handleSingleGridClick={props.handleSingleGridClick}
    isWinner={isWinner}/>)
  }
  return (
    <div className="SingleRowDiv">
      {result}
    </div>
  );
});

type SingleGridProps = {
  input: string;
  rowIndex: number;
  columnIndex: number;
  handleSingleGridClick: (a: number, b: number) => void;
  isWinner: boolean;
}

const SingleGrid = React.memo((props: SingleGridProps) => {
  let winningClass = "";
  if(props.isWinner) winningClass = "Winner";
  return (
    <div onClick={()=>{props.handleSingleGridClick(props.rowIndex, props.columnIndex)}} className={"SingleGridDiv " + winningClass}>
      <span className="SingleGridSpan">{props.input}</span>
    </div>
  );
});