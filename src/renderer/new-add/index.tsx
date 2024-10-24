// eslint-disable-next-line import/no-unresolved
import HashStr from 'main/db/Hash11'
import { useEffect, useState } from 'react'


const itdo: tradeDataObject = {
  id: HashStr.hash11(),
  date: new Date(),
  code: 0,
  tradeType: '現物買',
  holdType: '一般',
  quantity: 0,
  price: 0,
  fee: 0,
  tax: 0,
}

let ableInsert = true

export const NewAdd = () => {
  const [tdo, setTdo] = useState(itdo)

  const setTradeData = (tt: tradeType, quant: any, price: any) => {
    if (typeof quant == 'number' && typeof price == 'number') return
    setTdo({
      ...tdo,
      tradeType: tt,
      quantity: quant,
      price: price,
    })
  }

  const insert = () => {
    setTdo({
      ...tdo,
      id: HashStr.hash11(),
      date: new Date(),
    })
    window.electronAPI.insert([tdo]).then((data) => {
        console.log("insert reject")
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
  }

  const insert2 = () => {
    if (!ableInsert) return 
    ableInsert = false
    window.electronAPI.insert([{
      id: HashStr.hash11(),
      date: new Date(),
      code: 0,
      tradeType: '現物買',
      holdType: '一般',
      quantity: 100,
      price: 100,
      fee: 0,
      tax: 0,
    }
    ]).then((data) => {
      console.log("insert reject")
      console.log(data)
      ableInsert = true
  }).catch((err) => {
      console.log(err)
  })
  }

  return (
    <div>
      <select
        value={tdo.tradeType}
        onChange={(e) =>
          setTradeData(e.target.value as tradeType, tdo.quantity, tdo.price)
        }
      >
        <option value="現物買">買い</option>
        <option value="現物売">売り</option>
      </select>
      <input
        type="number"
        value={tdo.quantity}
        step={100}
        min={100}
        onChange={(e) => setTradeData(tdo.tradeType, e.target.value, tdo.price)}
      ></input>
      <input
        type="number"
        value={tdo.price}
        step={100}
        min={100}
        onChange={(e) =>
          setTradeData(tdo.tradeType, tdo.quantity, e.target.value)
        }
      ></input>
      <button onClick={insert2}>crud</button>
    </div>
  )
}
