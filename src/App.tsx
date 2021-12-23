import React, { useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal, { ScrollRevealRef } from './utils/ScrollReveal';
// import ReactGA from 'react-ga';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';


const App = () => {

  const childRef = useRef<ScrollRevealRef>(null);
  let location = useLocation();

  useEffect(() => {
    // const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current!.init();
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
