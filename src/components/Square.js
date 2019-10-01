import React from 'react';

function Square(props) {
    return (
        <button className={`square ${props.winning ? "winning" : ""}`} onClick={props.onClick} >
            {props.value}
        </button>
    );
}

export default Square