import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board'
import History from './components/History'
import './index.css';

class Game extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            history: [{
                squares: [],
                piece: null,
                squareNum: -1,
            }],
            reverse: true,
            twice: true,
            cursor: 0,
            size: 4,
        }
    }

    handleClick(i) {
        const history = this.state.history;
        let cursor = this.state.cursor;
        const current = history[cursor];
        const squares = current.squares.slice();
        const calc = calculateWinner(squares, this.state.size);
        const winner = squares[calc[0]];
        const turns = this.state.twice ? 2 : 1;

        if (winner || squares[i]) return;

        const xIsNext = Math.floor(cursor / turns) % 2 === 0;
        squares[i] = xIsNext ? 'X' : 'O';

        cursor++;
        let newHistory = history.slice(0, cursor).concat([{
            squares: squares,
            piece: squares[i],
            squareNum: i,
        }]);

        this.setState({
            history: newHistory,
            cursor: cursor,
        });
    } 

    changeOptions(e) {
        if (e.target.name === "board-size") this.setState({size: e.target.value});
        if (e.target.name === "two-turns") this.setState({twice: e.target.checked});
        return true;
    }

    reverseTimeline(e) {
        this.setState({
            reverse: e.target.checked
        });
    }

    handleTimeTravel(i) {
        this.setState({
            cursor: i,
        });
    }

    newGame(e) {
        this.setState({
            history: [{
                squares: [],
                piece: null,
                squareNum: -1,
            }],
            cursor: 0,
        });
    }

    render() {
        const history = this.state.history;
        const cursor = this.state.cursor;
        const current = history[cursor];
        const calc = calculateWinner(current.squares, this.state.size);
        const winner = current.squares[calc[0]];

        let historyClass = "history" + (Math.floor(history.length / 6) * 6);

        let status;
        let gameEnd = false;
        if (winner) {
            status = `Winner: ${winner}`;
            gameEnd = true;
        } else if (cursor >= this.state.size * this.state.size) {
            status = `Draw game`;
            gameEnd = true;
        } else {
            const turns = this.state.twice ? 2 : 1;
            const xIsNext = Math.floor(cursor / turns) % 2 === 0;
            status = `${xIsNext ? 'X' : 'O'}'s turn`;
        }

        let newGameBtn = null;
        if (gameEnd) {
            newGameBtn = (
                <button onClick={(e) => this.newGame(e)}>
                    NEW GAME
                </button>
            );
        }

        return (
            <div className="game">
                <div className="game-options">
                    <div className="board-size">
                        <label>
                            <span>Board size: {this.state.size}x{this.state.size}</span>
                        <input name="board-size" type="range" min="2" max="5" className="slider" value={this.state.size} onChange={(e) => this.changeOptions(e)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            <input name="two-turns" type="checkbox" checked={this.state.twice} onChange={(e) => this.changeOptions(e)} />
                            Two turns
                        </label>
                    </div>
                </div>
                <div className="game-board">
                    <Board 
                        size={this.state.size}
                        winSquares={calc}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                    <div className="status">
                        <span>{status}</span>
                        { newGameBtn }
                    </div>
                </div>
                <div className="game-info">
                    <div className="reverse">
                        <label>
                            <input type="checkbox" checked={this.state.reverse} onChange={(e) => this.reverseTimeline(e)}/>
                            Reverse timeline
                        </label>
                    </div>
                    <ol reversed={this.state.reverse} className={historyClass}>
                        <History 
                            size={this.state.size}
                            reverse={this.state.reverse}
                            cursor={cursor}
                            history={history} 
                            onTimeTravel={(i) => this.handleTimeTravel(i)}
                        />
                    </ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares, size) {

    let wins = [];

    for (let y = 0; y < size; y++) {
        let first = squares[y * size], broken = false;
        if (!first) continue;
        wins[0] = y * size;
        for (let x = 1; x < size; x++) {
            let i = y * size + x;
            broken = squares[i] !== first;
            if (broken) break;
            wins[x] = i;
        }
        if (!broken) return wins;
    }

    for (let x = 0; x < size; x++) {
        let first = squares[x], broken = false;;
        if (!first) continue;
        wins[0] = x;
        for (let y = 1; y < size; y++) {
            let i = y * size + x;
            broken = squares[i] !== first;
            if (broken) break;
            wins[y] = i;
        }
        if (!broken) return wins;
    }

    let first = squares[0], broken = false;
    if (first) {
        wins[0] = 0;
        for (let xy = 1; xy < size; xy++) {
            let i = xy * size + xy;
            broken = squares[i] !== first;
            if (broken) break;
            wins[xy] = i;
        }
        if (!broken) return wins;
    }

    first = squares[size *  (size - 1)];
    if (first) {
        broken = false;
        wins[0] = size *  (size - 1);
        for (let xy = 1; xy < size; xy++) {
            let i = (size - xy - 1) * size + xy;
            broken = squares[i] !== first;
            if (broken) break;
            wins[xy] = i;
        }
        if (!broken) return wins;
    }

    return [];
}
