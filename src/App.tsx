import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
//import { createBrowserHistory } from 'history';
import './App.scss';
import { MovieView } from './components/MovieView';
import { NavBar } from './components/NavBar';

function App() {
  //const history = createBrowserHistory();

  return (
    <Router>
      <div className="App">
        <NavBar />

        <Routes>
          <Route path='/' element={<MovieView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
