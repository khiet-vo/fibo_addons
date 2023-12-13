import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const hostWs = 'http://localhost:3001/';
const LIMIT_NUMBER = 100_000;
const MSG_ERR_INPUT =
    'Input should be an Int, and start from 0 and less than ' + LIMIT_NUMBER;
const socket = io.connect(hostWs);

function App() {
    const [errorConnect, setErrorConnect] = useState();
    const [error, setError] = useState();
    const [strNumbers, setStrNumber] = useState('');

    useEffect(() => {
        socket.on('receive_number', (data) => {
            setStrNumber((strNumbers) => strNumbers + '\n' + data.value);
        });
        return () => socket.off('receive_number');
    }, []);
    useEffect(() => {
        console.log(
            '🚀 ~ file: App.js:23 ~ socket.on ~ connect_error useEffect'
        );

        socket.once('connect_error', () => {
            console.log('🚀 ~ file: App.js:23 ~ socket.on ~ connect_error');
            setErrorConnect('Cannot connect to host');
        });
        socket.once('connect', function () {
            console.log('🚀 ~ file: App.js:23 ~ socket.on ~ connect');
            setErrorConnect();
        });
        return () => {
            socket.off('connect_error');
            socket.off('connect');
        };
    }, [errorConnect]);
    function validateInput(input) {
        try {
            input = parseInt(input);
        } catch (error) {
            return false;
        }
        return Number.isInteger(input) && input >= 0 && input <= LIMIT_NUMBER;
    }
    function onChangeInput(e) {
        if (!validateInput(e.target.value)) {
            setError(MSG_ERR_INPUT);
        } else {
            setError();
        }
    }
    function onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const value = e.target.input.value;
        if (validateInput(value)) {
            setError();
            socket.emit('sendNumber', { value });
        } else {
            setError(MSG_ERR_INPUT);
        }
    }
    const isDisabled = !!errorConnect || !!error;
    return (
        <div className="App">
            <h1 className="title">Hello React ft. Million</h1>
            {errorConnect && (
                <label className="error">
                    Connection Error:{errorConnect} {hostWs}
                </label>
            )}
            <div className="content">
                <form className="formWrapper" onSubmit={onSubmit}>
                    <div className="groupInput">
                        {error && (
                            <label className="error" htmlFor="input">
                                {error}
                            </label>
                        )}
                        <input
                            id="input"
                            type="number"
                            name="input"
                            onChange={onChangeInput}
                        />
                    </div>
                    <button type="submit" disabled={isDisabled}>
                        Send Number
                    </button>
                </form>
                <p className="renderFibo">{strNumbers}</p>
            </div>
        </div>
    );
}

export default App;
