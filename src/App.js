import React, { useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
// import ReactGA from 'react-ga';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';
import firebase from "firebase";

// Initialize Google Analytics
// TODO: doubt it's legal without consent cookies stuff
// ReactGA.initialize(process.env.REACT_APP_GA_CODE);
//
// const trackPage = page => {
//   ReactGA.set({ page });
//   ReactGA.pageview(page);
// };

firebase.initializeApp({
  projectId: 'langame-86ac4',
  apiKey: 'AIzaSyDxLmqscMfKF6FUd_rXcsJxH--w0PQhVWw',
  authDomain: 'langame-86ac4.firebaseapp.com',
});
const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    // const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    // trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
          <AppRoute exact path='/' component={Home} layout={LayoutDefault} />
        </Switch>
      )} />
  );
}



export default App;
