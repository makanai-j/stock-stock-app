import HashStr from '../../hooks/Hash11'
import { useState } from 'react'
import "./index.css"


export const AddRecordBar = ({initializedTrade}: {initializedTrade: TradeRecord}) => {
  const [trade, setTrade] = useState(initializedTrade)
  const [ableInsert, setAbleInsert] = useState(true)

  const initializeTrade = () => setTrade({...trade, id: HashStr.randCode(), date: new Date()})

  const insert = () => {
    if (!ableInsert) return
    setAbleInsert(false)
    window.crudAPI
      .insert([trade])
      .then(() => {
        console.log('insert resolve')
        initializeTrade()
        setAbleInsert(true)
        window.crudAPI
          .select({  })
          .then((data) => {
            console.log(data)
          })
      })
      .catch((err) => {
        console.log(err)
        if (err && err.failId) {
          console.log('trade db error')
          setAbleInsert(true)
        }
      })
  }

  return (
    <div className='add-record-bar'>
      {/** datetime */}
      <input
        type="datetime-local"
        onChange={(e) => setTrade({ ...trade, date: e.target.value })}
      />
      {/** symbol */}
      <input type="text" maxLength={4}></input>
      {/** tradetype */}
      <select
        value={trade.tradeType}
        onChange={(e) =>
          setTrade({ ...trade, tradeType: e.target.value as TradeType })
        }
      >
        {[
          '現物買',
          '現物売',
          '信用新規買',
          '信用新規売',
          '信用返済買',
          '信用返済売',
        ].map((type,index) => (
          <option value={type} key={index}>{type}</option>
        ))}
      </select>
      {/** quantity */}
      <input
        type="number"
        value={trade.quantity}
        step={100}
        min={100}
        onChange={(e) =>
          setTrade({ ...trade, quantity: Number(e.target.value) })
        }
      ></input>
      {/** price fee tax */}
      {['price', 'fee', 'tax'].map((field) => (
        <input
          key={field}
          type="number"
          value={trade[field as keyof TradeRecord] as number}
          onChange={(e) =>
            setTrade({ ...trade, [field]: Number(e.target.value) })
          }
        />
      ))}
      {/** holdtype */}
      <select
        onChange={(e) =>
          setTrade({ ...trade, holdType: e.target.value as HoldType })
        }
      >
        {['一般', '特定', 'NISA'].map((type, index) => (
          <option value={type} key={index}>{type}</option>
        ))}
      </select>
      <button onClick={insert}>crud</button>
    </div>
  )
}
