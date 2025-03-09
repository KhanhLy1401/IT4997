import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home.js';
import Header from './components/Header/Header.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
      </header>
      
      <div className='main'>
        <Home/>
      </div>
    </div>
  );
}

export default App;
