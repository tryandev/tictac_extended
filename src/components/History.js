import React from 'react';

function History(props) {
    const history = props.history;
    const cursor = props.cursor;
    const ret = history.map((historyMove, index) => {
        const moveName = index === 0 ? "Game start" : ''; //`Play #${index},`;
        let descrip = `${moveName}`;
        let x = historyMove.squareNum % props.size + 1;
        let y = Math.floor(historyMove.squareNum / props.size) + 1;
        if (index > 0) {
            descrip = `${descrip} ${historyMove.piece} on [${x}, ${y}]`;
        }
        let isCurrent = cursor === index;
        let currentClass = isCurrent ? "current" : ""
        return (
            <li key={index}>
                <button className={currentClass} onClick={() => props.onTimeTravel(index)} key={index}>
                    {descrip}
                </button>
            </li>
        )
    });
    if (props.reverse) ret.reverse();
    return ret;
}

export default History