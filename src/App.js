import logo from './logo.png';
import appStore from './app-store.svg';
import googlePlay from './google-play.svg';
import './App.css';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import ReactTooltip from 'react-tooltip';

function App() {
  const Mailto = ({ email, subject = '', body = '', children }) => {
    let params = subject || body ? '?' : '';
    if (subject) params += `subject=${encodeURIComponent(subject)}`;
    if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`;

    return <a href={`mailto:${email}${params}`}>{children}</a>;
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2 className="App-name">Langame</h2>
        <h3 className="App-description">Augmented human conversations.</h3>
        <ReactTooltip id="main"/>

        <div className="App-store">
          <p data-for="main" data-tip="Coming soon on iOS." data-iscapture="true">
            <img src={appStore} alt="App Store"/>
          </p>
        </div>

        <div className="App-google-play">
          <p data-for="main" data-tip="Coming soon on Android." data-iscapture="true">
            <img src={googlePlay} alt="Google Play"/>
          </p>
        </div>


      </header>
      <footer className="App-footer">
        <Mailto email="louis.beaumont@gmail.com">
          <MailOutlineOutlinedIcon />
        </Mailto>
      </footer>
    </div>
  );
}

export default App;
