import { Button } from '@mui/material'

import './index.css'
import { csvReader } from './csvReader'

export const CSVInmport = (props: {
  setFailMessage: React.Dispatch<React.SetStateAction<string>>
}) => {
  const readCSV = () => {
    window.electronAPI
      .fileRead()
      .then((result) => {
        console.log(result)
        const trades = csvReader(result)
        console.log(trades)
        window.crudAPI
          .insert(trades)
          .then(() => console.log(`${trades.length}件の取引を保存しました`))
          .catch((e) => {
            if (e.failId) {
              trades.forEach((trade) => {
                if (trade.id === e.failId) console.log(trade)
              })
            }
          })
      })
      .catch(() => props.setFailMessage('ファイルの取得に失敗しました'))
  }

  return (
    <div>
      <Button
        sx={{
          height: '24px',
          margin: '5px',
          color: '#ccf',
          backgroundColor: 'rgba(150,150,220,0.3)',
          fontSize: '11px',
          fontWeight: 600,
          '&.MuiButtonBase-root:hover': {
            color: '#1E1E3F',
            backgroundColor: 'rgba(200,200,255,0.7)',
          },
        }}
        onClick={readCSV}
      >
        CSV
      </Button>
      {/* {show && (
        <>
          <div
            className="csv-drag-drop"
            id="drop_zone"
            onDrop={dropHandler}
            onDragOver={(e) => {
              console.log('drop')
              e.preventDefault()
            }}
          >
            <p>CSVファイルをドラッグ</p>
          </div>
          <div className="csv-outer" onClick={() => setShow(false)}></div>
        </>
      )} */}
    </div>
  )
}
