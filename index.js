import React from 'react'
import ReactDOM from 'react-dom'

class Square extends React.Component {
  constructor(){
    super();
    this.state = {
      value: null
    }
  }
  render() {
    return (
      // stateをpropsに変えた
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value} 
      </button>
    );
  }
}
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }
  renderSquare(i) {
    console.log(i);
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} key={i} />;
  }
  renderSquares(){
    var rt = [];
    for(var i = 0; i < 3; i++){
      rt.push([
        <div className="board-row">
          {this.renderSquareRow(i)}
        </div>
      ])
    }
    return rt
  }
  renderSquareRow(i){
    var a = []
    for(var j = 0; j < 3; j++){
      a.push(this.renderSquare(i * 3 + j))
    }
    return a
  }
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      // <div>
      //   <div className="status">{status}</div>
      //   <div className="board-row">
      //     {this.renderSquare(0)}
      //     {this.renderSquare(1)}
      //     {this.renderSquare(2)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(3)}
      //     {this.renderSquare(4)}
      //     {this.renderSquare(5)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(6)}
      //     {this.renderSquare(7)}
      //     {this.renderSquare(8)}
      //   </div>
      // </div>
      <div>
        <div className="status">{status}</div>
          {this.renderSquares()}
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }
  
  handleClick(i) {
    var history = this.state.history.slice(0, this.state.stepNumber + 1);
    var current = history[history.length - 1]; //一個前のマス情報の入ったオブジェクト
    const squares = current.squares.slice();  //一個前のます情報の入った配列
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{  //historyはオブジェクトの配列
        squares: squares  //squaresは配列
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
   jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];  //今のマス情報
    const winner = calculateWinner(current.squares);
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, move) => {  //引数: value, index, array
      const desc = move ?
        'Move #' + move :
        'Game Start';  //aタグの文字,１番目だけ違う
      return (
        <li key={move}> {/*兄弟との区別をつけるために、同じタグのものが兄弟になったらkeyが必要*/}
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('container')
);
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

