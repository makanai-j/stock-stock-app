import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import DeleteIcon from '@mui/icons-material/Delete'
import { MenuItem, TableRow } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'

import HashStr from 'renderer/InputTrades/hooks/Hash11'
import { useInputTradesDispatch } from 'renderer/InputTrades/InputTradesContext'
import {
  IconButtonCancel,
  IconButtonNormal,
  MyDateTimePicker,
  MySelect,
  MyTextField,
  MyNumberField,
  StyledTableCell,
} from 'renderer/MyMui'

export const TradeTabledRow = ({
  trade,
  index,
}: {
  trade: TradeRecord
  index: number
}) => {
  const [dateTime, setDateTime] = useState(dayjs(trade.date))
  const dispatch = useInputTradesDispatch()
  //const [trade, setTrade] = useState(initializedTrade)

  console.log(trade.id)

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <StyledTableCell>
        <IconButtonNormal
          aria-label="copyAdd"
          size="small"
          sx={{
            color: 'rgb(220,220,220)',
          }}
          onClick={() =>
            dispatch &&
            dispatch({
              type: 'push',
              trade: { ...trade, id: HashStr.randCode() },
            })
          }
        >
          <AddToPhotosIcon fontSize="inherit" />
        </IconButtonNormal>
      </StyledTableCell>
      {/* group */}
      <StyledTableCell>
        <button
          onClick={() =>
            dispatch && dispatch({ type: 'pushInGroup', id: trade.id })
          }
        >
          g
        </button>
      </StyledTableCell>
      {/**
       * datetime
       * numberで保存することで、sqlとjsでの違いをなくす
       */}
      <StyledTableCell>
        <ShowOnFirstIndex text={formatToDateTime(trade.date)} index={index}>
          <MyDateTimePicker
            format="YYYY/M/D H:m"
            value={dayjs(trade.date)}
            onClose={() =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: {
                  ...trade,
                  date: dateTime.valueOf(),
                },
              })
            }
            onChange={(e) => e && setDateTime(e)}
          />
        </ShowOnFirstIndex>
      </StyledTableCell>
      {/** symbol */}
      <StyledTableCell>
        <ShowOnFirstIndex text={trade.symbol} index={index}>
          <MyTextField
            value={trade.symbol}
            sx={{ width: '80px' }}
            onChange={(e) =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: { ...trade, symbol: e.target.value },
              })
            }
          />
        </ShowOnFirstIndex>
      </StyledTableCell>
      {/** tradetype */}
      <StyledTableCell>
        <ShowOnFirstIndex text={trade.tradeType} index={index}>
          <MySelect
            value={trade.tradeType}
            onChange={(e) =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: {
                  ...trade,
                  tradeType: e.target.value as TradeType,
                },
              })
            }
          >
            {[
              '現物買',
              '現物売',
              '信用新規買',
              '信用新規売',
              '信用返済買',
              '信用返済売',
            ].map((type, i) => (
              <MenuItem value={type} key={type} sx={{ fontSize: '13px' }}>
                {type}
              </MenuItem>
            ))}
          </MySelect>
        </ShowOnFirstIndex>
      </StyledTableCell>
      {/** quantity */}
      <StyledTableCell>
        <MyNumberField
          value={trade.quantity}
          sx={{ width: '80px' }}
          onChange={(e) =>
            dispatch &&
            dispatch({
              type: 'update',
              trade: { ...trade, quantity: Number(e.target.value) },
            })
          }
        />
      </StyledTableCell>
      {/** price fee tax */}
      {['price', 'fee', 'tax'].map((field) => (
        <StyledTableCell key={field}>
          <MyNumberField
            value={trade[field as keyof TradeRecord] as number}
            sx={{ width: '80px' }}
            onChange={(e) =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: { ...trade, [field]: Number(e.target.value) },
              })
            }
          />
        </StyledTableCell>
      ))}
      {/** holdtype */}
      <StyledTableCell>
        <ShowOnFirstIndex text={trade.holdType} index={index}>
          <MySelect
            value={trade.holdType}
            onChange={(e) =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: {
                  ...trade,
                  holdType: e.target.value as HoldType,
                },
              })
            }
          >
            {['一般', '特定', 'NISA'].map((type) => (
              <MenuItem value={type} key={type} sx={{ fontSize: '13px' }}>
                {type}
              </MenuItem>
            ))}
          </MySelect>
        </ShowOnFirstIndex>
      </StyledTableCell>
      <StyledTableCell>
        <IconButtonCancel
          aria-label="delete"
          size="small"
          sx={{ color: 'rgb(220,100,100)' }}
          onClick={() => dispatch && dispatch({ type: 'delete', id: trade.id })}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButtonCancel>
      </StyledTableCell>
    </TableRow>
  )
}

const formatToDateTime = (date: Date | number | string) => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}`
}

// コンポーネントをコンポーネント内で定義すると再マウントされて
// inputのフォーカス外れちゃうから気をつけようね！
const ShowOnFirstIndex = ({
  children,
  text,
  index,
}: {
  children: any
  text: string
  index: number
}) => {
  return (
    <div>
      {index == 0 ? (
        children
      ) : (
        <div className="input" style={{ textAlign: 'center' }}>
          {text}
        </div>
      )}
    </div>
  )
}
