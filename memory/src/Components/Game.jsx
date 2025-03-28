import React, { useState, useEffect } from 'react';
import Data from './Data';
import './style.css';

const Game = () => {
    const [data, setData] = useState(Data);
    const [score, setScore] = useState(0);
    const [record, setRecord] = useState(0);
    const [track, setTrack] = useState([]);
    const [counter, setCounter] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Initialize game - shuffle cards and load saved record
    useEffect(() => {
        shuffle();
        const savedRecord = localStorage.getItem('memoryGameRecord');
        if (savedRecord) setRecord(Number(savedRecord));
    }, []);

    // Save record to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('memoryGameRecord', record);
    }, [record]);

    // Check for game over condition
    useEffect(() => {
        if (counter === 6) {
            setGameOver(true);
            setTimeout(() => {
                handleGameReset();
                setGameOver(false);
            }, 1500);
        }
    }, [counter]);

    // Fisher-Yates shuffle algorithm
    function shuffle() {
        const newArray = [...data];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        setData(newArray);
    }

    // Reset game state
    const handleGameReset = () => {
        setTrack([]);
        setScore(0);
        setCounter(0);
        shuffle();
    };

    // Handle card click
    function handleClick(card) {
        if (gameOver) return;
        
        if (track.includes(card.id)) {
            if (score > record) setRecord(score);
            handleGameReset();
            return;
        }
        
        setTrack([...track, card.id]);
        setScore(score + 1);
        setCounter(counter + 1);
        setRecord(Math.max(record, score + 1));
        shuffle();
    }

    return (
        <>
            <div className='header'>
                <h3 className='score'>Current Score: {score}</h3>
                <h1 className='heading'>Memory Card Game!</h1>
                <h3 className='record'>Highest score record: {record}</h3>
                {gameOver && <div className="game-over">Game Over!</div>}
            </div>
            <div className='cards'>
                {data.map((card) => (
                    <div key={card.id} className="card-container">
                        <button 
                            className={`cardBtn ${gameOver ? 'disabled' : ''}`}
                            onClick={() => handleClick(card)}
                            disabled={gameOver}
                        >
                            <img src={card.img} alt={card.name} />
                            <div className="card-name">{card.name}</div>
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Game;