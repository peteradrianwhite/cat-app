import logo from './logo.svg';
import CatInfo from './CatInfo';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Cat Picture and Fact</h1>
        <CatInfo />
      </header>
    </div>
  );
};

export default App;
