import History from '../history'
import { NewAdd } from 'renderer/new-add'

const App = () => {
  const fileR = () => {
    window.electronAPI
      .fileRead()
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <NewAdd></NewAdd>
    </div>
  )
}

export default App
