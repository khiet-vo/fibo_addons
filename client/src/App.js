import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const hostWs = process.env.HOSTWS || 'http://localhost:3001/';
const LIMIT_NUMBER = process.env.LIMIT_NUMBER || 1_000_000;
const MSG_ERR_INPUT =
    'Input should be an Int, and start from 0 and less than ' + LIMIT_NUMBER;
const socket = io.connect(hostWs);

function App() {
    const [errorConnect, setErrorConnect] = useState();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [strNumbers, setStrNumber] = useState('');

    useEffect(() => {
        socket.on('receive_number', (data) => {
            if (data.isFinished) {
                setLoading(false);
            } else if (data.error) {
                setError(data.error);
            } else {
                setStrNumber((strNumbers) => strNumbers + '\n' + data.value);
            }
        });
        return () => socket.off('receive_number');
    }, []);
    useEffect(() => {
        socket.once('connect_error', () => {
            setErrorConnect('Cannot connect to host');
        });
        socket.once('connect', function () {
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
            setLoading(true);
            setStrNumber('');
            socket.emit('sendNumber', { value });
        } else {
            setError(MSG_ERR_INPUT);
        }
    }
    const isDisabled = !!errorConnect || !!error || isLoading;
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
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" disabled={isDisabled}>
                        Send Number
                    </button>
                </form>
                {isLoading && <p className="renderFibo">Loading...</p>}
                <p className="renderFibo">{strNumbers}</p>
            </div>
        </div>
    );
}

export default App;
