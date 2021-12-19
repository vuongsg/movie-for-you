import { Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './App.scss';
import { MovieView } from './components/MovieView';
import { NavBar } from './components/NavBar';

function App() {
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <div className="App">
        <NavBar />

        <Switch>
          <Route path='/' component={MovieView} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
