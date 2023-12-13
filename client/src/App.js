import { useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const hostWs = 'http://localhost:3001/';
const LIMIT_NUMBER = 100_000;

const socket = io.connect(hostWs);

function App() {
    useEffect(() => {
        socket.on('receive_number', (data) => {
            console.log('🚀 ~ file: App.js:11 ~ socket.on ~ data:', data);
        });
        return () => socket.off('receive_number');
    }, [socket]);

    function validateInput(input) {
        try {
            input = parseInt(input);
        } catch (error) {
            return false;
        }
        return Number.isInteger(input) && input >= 0 && input <= LIMIT_NUMBER;
    }
    function onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const value = e.target.input.value;
        if (validateInput(value)) {
            socket.emit('sendNumber', { value });
        }
    }
    return (
        <div className="App">
            <h1 className="title">Hello React ft. Million</h1>
            <div className="content">
                <form className="formWrapper" onSubmit={onSubmit}>
                    <input type="number" name="input" />
                    <button type="submit">Send Number</button>
                </form>
            </div>
        </div>
    );
}

export default App;
