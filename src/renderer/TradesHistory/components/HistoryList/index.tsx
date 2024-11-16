import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

import { priceFormatter } from 'renderer/hooks/priceFormatter'
import { BaseDatePicker } from 'renderer/MyMui'
import {
  formatToDateDay,
  formatToTime,
} from 'renderer/TradesHistory/hooks/formatToTime'
import {
  useSelectedTrades,
  useSelectedTradesDispatch,
} from 'renderer/TradesHistory/SelectedTradesContext'
import {
  useYFOptions,
  useYFOptionsDispatch,
} from 'renderer/TradesHistory/YFOptionsContext'

const stickyStyles = {
  header: [
    {
      position: 'sticky',
      left: 0,
      minWidth: 44,
      zIndex: 120,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: '',
    },
    {
      position: 'sticky',
      left: 50,
      minWidth: 144,
      zIndex: 120,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 2,
      borderColor: 'rgba(100,100,200,0.5)',
    },
  ],
  cell: [
    {
      position: 'sticky',
      left: 0,
      minWidth: 50,
      zIndex: 0,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: '',
    },
    {
      position: 'sticky',
      left: 50,
      minWidth: 50,
      zIndex: 100,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: '',
    },
    {
      position: 'sticky',
      left: 100,
      minWidth: 100,
      zIndex: 100,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 2,
      borderColor: 'rgba(100,100,200, 0.5)',
    },
  ],
}

/** 履歴リスト */
export const HistoryList = () => {
  const [listTrades, setListTrades] = useState<TradeRecordRaw[]>([])
  const [hoverTrade, setHoverTrade] = useState<TradeRecordRaw | null>(null)
  const selectedTrades = useSelectedTrades()
  const tradesDispatch = useSelectedTradesDispatch()
  const yfOptions = useYFOptions()
  const yfOptionsDispatch = useYFOptionsDispatch()

  useEffect(() => {
    window.crudAPI
      .select({ limit: 1, mode: 'raw', order: 'DESC' })
      .then((trades) => {
        if (trades.length) {
          console.log(trades)
          setChartsTrades(trades[0].id)
          setListPeriod(trades[0].date)
        }
      })
  }, [])

  const setChartsTrades = (tradeId: string) => {
    window.crudAPI.select({ mode: 'raw', id: tradeId }).then((trades) => {
      if (trades.length) {
        const period1 = new Date(trades[0].date)
        const period2 =
          trades.length > 0
            ? new Date(trades[trades.length - 1].date)
            : new Date()

        yfOptionsDispatch &&
          yfOptionsDispatch({
            type: 'set',
            options: { interval: yfOptions?.interval, period1, period2 },
          })

        tradesDispatch && tradesDispatch({ type: 'set', trades: trades })
      }
    })
  }

  const setListPeriod = (date: string | number | Date) => {
    const period1 = new Date(date)
    period1.setDate(1)
    period1.setHours(0, 0)
    const period2 = new Date(date)
    period2.setMonth(period2.getMonth() + 1)
    period2.setDate(0)
    period2.setHours(23, 59)
    window.crudAPI
      .select({
        mode: 'raw',
        filter: { period1: period1.getTime(), period2: period2.getTime() },
      })
      .then((trades) => {
        if (trades.length) {
          setListTrades(trades)
        }
      })
  }

  const listBackroundColor = (id: string) => {
    return {
      backgroundColor:
        (selectedTrades &&
          selectedTrades.map((trade) => trade.id).includes(id)) ||
        (hoverTrade && hoverTrade.id == id)
          ? '#2D2B55'
          : '#222244',
      '&.MuiTableRow-root:hover': {
        backgroundColor: '#2D2B55',
      },
    }
  }

  return (
    <div>
      <div style={{ height: '24px', padding: '5px' }}>
        <BaseDatePicker
          format="YYYY/M"
          formatDensity="spacious"
          views={['year', 'month']}
          slotProps={{
            calendarHeader: { format: 'YYYY/M' },
          }}
          onChange={(e) => e && setListPeriod(e.toString())}
        />
      </div>
      <TableContainer
        className="table-container"
        sx={{ width: 300, minWidth: 300 }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            direction: 'ltr',
          }}
        >
          <TableHead sx={{ backgroundColor: '#eef' }}>
            <TableRow>
              <StickyTableCell align="center" sx={stickyStyles.header[0]}>
                時間
              </StickyTableCell>
              <StickyTableCell
                align="center"
                sx={stickyStyles.header[1]}
                colSpan={2}
              >
                銘柄
              </StickyTableCell>
              <StyledTableCell align="center">取引</StyledTableCell>
              <StyledTableCell align="center">株数</StyledTableCell>
              <StyledTableCell align="center">値段</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listTrades.map((trade, i) => (
              <React.Fragment key={trade.id}>
                {(i == 0 ||
                  new Date(listTrades[i - 1].date).getDate() !==
                    new Date(trade.date).getDate()) && (
                  <TableRow>
                    <StickyTableCell align="center" sx={stickyStyles.cell[0]}>
                      {`${formatToDateDay(trade.date)}`}
                    </StickyTableCell>
                    <StickyTableCell
                      sx={stickyStyles.cell[1]}
                    ></StickyTableCell>
                    <StickyTableCell
                      sx={stickyStyles.cell[2]}
                    ></StickyTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                )}
                <TableRow
                  hover
                  sx={{
                    backgroundColor:
                      selectedTrades &&
                      selectedTrades.map((trade) => trade.id).includes(trade.id)
                        ? '#2D2B55'
                        : '#222244',
                    '&.MuiTableRow-root:hover': {
                      backgroundColor: '#2D2B55',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => setChartsTrades(trade.id)}
                  onMouseEnter={() => setHoverTrade(trade)}
                  onMouseLeave={() => setHoverTrade(null)}
                >
                  <StickyTableCell
                    sx={{
                      ...stickyStyles.cell[0],
                      ...listBackroundColor(trade.id),
                    }}
                    align="center"
                  >
                    {formatToTime(trade.date)}
                  </StickyTableCell>
                  <StickyTableCell
                    sx={{
                      ...stickyStyles.cell[1],
                      ...listBackroundColor(trade.id),
                    }}
                    align="center"
                  >
                    {trade.symbol}
                  </StickyTableCell>
                  <StickyTableCell
                    sx={{
                      ...stickyStyles.cell[2],
                      ...listBackroundColor(trade.id),
                    }}
                  >
                    {trade.company}
                  </StickyTableCell>
                  <StyledTableCell
                    sx={{ padding: '1px 3px', ...listBackroundColor(trade.id) }}
                  >
                    {trade.tradeType}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ padding: '1px 3px', ...listBackroundColor(trade.id) }}
                    align="right"
                  >
                    {priceFormatter(trade.quantity)}株
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ padding: '1px 3px', ...listBackroundColor(trade.id) }}
                    align="right"
                  >
                    {priceFormatter(trade.price)}円
                  </StyledTableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1E1E3F',
    color: '#ccf',
    padding: 0,
    fontSize: '11px',
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    maxWidth: '80px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: '#eef',
    fontSize: '11px',
    padding: 0,
    fontWeight: 200,
  },
}))
const StyledTableCell = styled(StickyTableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    padding: '1px 3px',
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    padding: '1px 3px',
    border: 0,
  },
}))

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   [`&.${tableRowClasses}`]: {
//     backgroundColor: '#fff',
//   },
//   [`&.${tableRowClasses.hover}`]: {
//     backgroundColor: '#317',
//   },
// }))
