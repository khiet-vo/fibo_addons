import './App.css';
import io from 'socket.io-client';
const hostWs = 'http://localhost:3001/';

const socket = io.connect(hostWs);

function App() {
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
