import logo from './chat-flat.svg';
import androidIos from './android-ios.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2 className="App-name">Langame</h2>
        <h3 className="App-description">Coming soon.</h3>
        <img className="App-android-ios" src={androidIos} alt="android-ios"/>

      </header>
    </div>
  );
}

export default App;
