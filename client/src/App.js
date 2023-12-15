import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const hostWs = process.env.HOSTWS || 'http://localhost:3001/';
const source = process.env.SOURCE || 'http://localhost:3001/fibonacci_nth/';
const LIMIT_NUMBER = process.env.LIMIT_NUMBER || 1_000_000;
const MSG_ERR_INPUT =
    'Input should be an Int, and start from 0 and less than ' + LIMIT_NUMBER;
const socket = io.connect(hostWs);
let startPer1;
let stopPer1;
let startPer2;
let stopPer2;
function App() {
    const [errorConnect, setErrorConnect] = useState();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [strNumbers, setStrNumber] = useState('');
    const [errorConnect2, setErrorConnect2] = useState();
    const [isLoading2, setLoading2] = useState(false);
    const [error2, setError2] = useState();
    const [strNumbers2, setStrNumber2] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [per1, setPer1] = useState('');
    const [per2, setPer2] = useState('');
    useEffect(() => {
        socket.on('receive_number', (data) => {
            if (data.isFinished) {
                stopPer1 = performance.now();
                setLoading(false);
                setPer1(stopPer1 - startPer1);
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
    function onChangeInput2() {}
    function onSubmit2(e) {
        e.preventDefault();
        e.stopPropagation();
        const value = e.target.input.value;
        if (validateInput(value) && !isListening) {
            setError2();
            setLoading2(true);
            setStrNumber2('');
            startPer2 = performance.now();
            const events = new EventSource(source + value);
            events.onmessage = (event) => {
                if (event.data !== 'finished') {
                    setStrNumber2(
                        (prevStrNumbers2) => prevStrNumbers2 + '\n' + event.data
                    );
                } else {
                    stopPer2 = performance.now();
                    setLoading2(false);
                    setPer2(stopPer2 - startPer2);
                    events.close();
                }
            };
        } else {
            setError(MSG_ERR_INPUT);
        }
    }
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
            startPer1 = performance.now();
            socket.emit('sendNumber', { value });
        } else {
            setError(MSG_ERR_INPUT);
        }
    }
    const isDisabled = !!errorConnect || !!error || isLoading;
    const isDisabled2 = !!errorConnect2 || !!error2 || isLoading2;
    return (
        <div className="App">
            <section className="wrapperApp">
                <h1 className="title">Fibonacci streaming socket</h1>
                {errorConnect && (
                    <label className="error">
                        Connection Error:{errorConnect} {hostWs}
                    </label>
                )}
                <div className="content">
                    <form className="formWrapper" onSubmit={onSubmit}>
                        <div className="groupInput">
                            <label>Time: {per1}</label>
                            {error && (
                                <label className="error" htmlFor="input">
                                    {error}
                                </label>
                            )}
                            <input
                                id="input"
                                type="number"
                                name="input"
                                placeholder="please enter positive integer"
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
            </section>
            <section className="wrapperApp">
                <h1 className="title">Fibonacci eventSource</h1>
                {errorConnect && (
                    <label className="error">
                        Connection Error:{errorConnect2}
                    </label>
                )}
                <div className="content">
                    <form className="formWrapper" onSubmit={onSubmit2}>
                        <div className="groupInput">
                            <label>Time: {per2}</label>
                            {error && (
                                <label className="error" htmlFor="input">
                                    {error2}
                                </label>
                            )}
                            <input
                                id="input"
                                type="number"
                                name="input"
                                placeholder="please enter positive integer"
                                onChange={onChangeInput2}
                                disabled={isLoading2}
                            />
                        </div>
                        <button type="submit" disabled={isDisabled2}>
                            Send Number
                        </button>
                    </form>
                    {isLoading2 && <p className="renderFibo">Loading...</p>}
                    <p className="renderFibo">{strNumbers2}</p>
                </div>
            </section>
        </div>
    );
}

export default App;
