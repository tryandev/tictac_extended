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
            xIsNext: true,
            cursor: 0,
            reverse: true,
            size: 3,
        }
    }

    handleClick(i) {
        const history = this.state.history;
        let cursor = this.state.cursor;
        const current = history[cursor];
        const squares = current.squares.slice();
        const calc = calculateWinner(squares, this.state.size);
        const winner = squares[calc[0]];
        if (winner || squares[i]) {
            return;
        }
        cursor++;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let newHistory = history.slice(0, cursor).concat([{
            squares: squares,
            piece: squares[i],
            squareNum: i,
        }]);
        this.setState({
            history: newHistory,
            xIsNext: !this.state.xIsNext,
            cursor: cursor,
        });
    } 

    changeBoardSize(e) {
        this.setState({
            size: e.target.value
        });
        return true;
    }

    reverseTimeline(e) {
        this.setState({
            reverse: e.target.checked
        });
    }

    handleTimeTravel(i) {
        this.setState({
            xIsNext: (i % 2) === 0,
            cursor: i,
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
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (cursor >= this.state.size * this.state.size) {
            status = `Draw game`;
        } else {
            status = `Current play: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="boardSize">
                    <label>
                        <span> Game board size: {this.state.size}x{this.state.size}</span>
                       <input type="range" min="2" max="5" className="slider" value={this.state.size} onChange={(e) => this.changeBoardSize(e)} />
                    </label>
                </div>
                <div className="game-board">
                    <Board 
                        size={this.state.size}
                        winSquares={calc}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                    <div className="status">{status}</div>
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
