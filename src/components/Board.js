import React from 'react';
import Square from './Square'

class Board extends React.Component {
    renderSquare(i) {
        let isWinningSquare = this.props.winSquares && this.props.winSquares.indexOf(i) > -1;
        return (
            <Square 
                key={i}
                winning={isWinningSquare}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let rows = [];
        let size = this.props.size;
        let sizeClass = size <= 3 ? "small" : "";
        for (let y = 0; y < size; y++) {
            let cols = [];
            for (let x = 0; x < size; x++){
                cols.push(this.renderSquare(y * size + x));
            }
            let row = <div key={y} className="board-row">{cols}</div>;
            rows.push(row);
        }
        return (
            <div className={sizeClass}>
                {rows}
            </div>
        );
    }
}

export default Board