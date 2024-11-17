import ListAltIcon from '@mui/icons-material/ListAlt'
import { MenuItem } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

import {
  BaseDatePicker,
  IconButtonNormal,
  MySelect,
  QuarterPicker,
} from 'renderer/MyMui'
import {
  useEChartsOption,
  useEChartsOptionDispatch,
} from 'renderer/ProfitAndLoss/EChartsOptionContext'
import { getDayCustom } from 'renderer/ProfitAndLoss/hooks/getDayCustom'

export const PnLHeader = (props: { toggle: () => void }) => {
  const eChartsOption = useEChartsOption()
  const eChartsOptionDispatch = useEChartsOptionDispatch()

  return (
    <div
      style={{
        height: '24px',
        padding: '5px',
        fontSize: '13px',
        display: 'flex',
      }}
    >
      <MySelect
        value={eChartsOption?.interval}
        onChange={(e) =>
          eChartsOptionDispatch &&
          eChartsOptionDispatch({
            type: 'setInterval',
            interval: e.target.value as PnLInterval,
          })
        }
        sx={{ marginLeft: '3px', marginRight: '6px' }}
      >
        <MenuItem value="1d">日</MenuItem>
        <MenuItem value="1w">週</MenuItem>
        <MenuItem value="1mo">月</MenuItem>
        <MenuItem value="1y">年</MenuItem>
      </MySelect>
      <SwitchDatePicker />
      <IconButtonNormal
        onClick={props.toggle}
        size="small"
        sx={{
          color: '#ccf',
          width: '24px',
          height: '24px',
          marginLeft: 'auto',
          marginRight: '5%',
        }}
      >
        <ListAltIcon fontSize="inherit" />
      </IconButtonNormal>
    </div>
  )
}

const SwitchDatePicker = () => {
  const eChartsOption = useEChartsOption()
  const eChartsOptionDispatch = useEChartsOptionDispatch()
  const [minDate, setMinDate] = useState(dayjs(new Date()))
  const [maxDate, setMaxDate] = useState(dayjs(new Date()))

  useEffect(() => {
    // min
    window.crudAPI
      .select({ mode: 'PnL', limit: 1, order: 'ASC' })
      .then((trades) => {
        if (trades.length) setMinDate(dayjs(trades[0].date))
        else {
          const d = dayjs(minDate)
          d.set('year', minDate.get('year') - 30)
        }
      })
      .catch((e) => console.log(e))

    // max
    window.crudAPI
      .select({ mode: 'PnL', limit: 1, order: 'DESC' })
      .then((trades) => {
        if (trades.length) setMaxDate(dayjs(trades[0].date))
      })
      .catch((e) => console.log(e))
  }, [])

  const changeFunc = (e: Dayjs) => {
    eChartsOptionDispatch &&
      eChartsOptionDispatch({
        type: 'setDate',
        date: new Date(e.toString()),
      })
  }

  switch (eChartsOption?.interval) {
    case '1d':
      return (
        <BaseDatePicker
          format="YYYY/M"
          formatDensity="spacious"
          closeOnSelect={true}
          views={['year', 'month']}
          slotProps={{
            calendarHeader: { format: 'YYYY / M' },
          }}
          onChange={(day) => day && changeFunc(day)}
          minDate={minDate}
          maxDate={maxDate}
          value={dayjs(eChartsOption.date)}
        />
      )
    case '1w':
      minDate.set('date', minDate.get('date') - getDayCustom(minDate.valueOf()))
      maxDate.set('date', maxDate.get('date') - getDayCustom(maxDate.valueOf()))
      return (
        <QuarterPicker
          onChange={(day) => day && changeFunc(day)}
          minDate={dayjs(minDate)}
          maxDate={dayjs(maxDate)}
          value={dayjs(eChartsOption.date)}
        />
      )
    case '1mo':
      return (
        <BaseDatePicker
          format="YYYY"
          formatDensity="spacious"
          closeOnSelect={true}
          // calendar header を表示するために2つ入れる
          views={['year', 'year']}
          slotProps={{
            calendarHeader: { format: 'YYYY' },
          }}
          onChange={(day) => day && changeFunc(day)}
          minDate={minDate}
          maxDate={maxDate}
          value={dayjs(eChartsOption.date)}
        />
      )
  }
  return <div></div>
}
