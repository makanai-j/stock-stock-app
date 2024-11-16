import { HashRouter as Router, Route, Routes } from 'react-router-dom'

import { GainAndLoss } from 'renderer/GainAndLoss'
import { InputTrades } from 'renderer/InputTrades'
import { TradesHistory } from 'renderer/TradesHistory'

import { Header } from './components/Header'

export const App = () => {
  return (
    <main style={{ height: '100vh' }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" Component={GainAndLoss} />
          <Route path="/history" Component={TradesHistory} />
          <Route path="/input" Component={InputTrades} />
        </Routes>
      </Router>
    </main>
  )
}

export default App
