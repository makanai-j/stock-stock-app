import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {TradesHistory} from '../TradesHistory'
import { InputTrades } from 'renderer/InputTrades'

const App = () => {
  return (
    <div>
    <Router>
    <Navbar></Navbar>
      <Routes>
        <Route path="/"  Component={TradesHistory} />
        <Route path="/a" Component={InputTrades} />
      </Routes>
    </Router>
    </div>
  );
};

const Navbar = () => {
    return(
        <div className="navbar">
            <ul>
                <li><Link to={'/'}>R</Link></li>
                <li><Link to={'/a'}>A</Link></li>
            </ul>
        </div>
    )
}

export default App
