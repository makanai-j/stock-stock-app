import { MenuItem } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect } from 'react'
import {
  useEChartsOption,
  useEChartsOptionDispatch,
} from 'renderer/GainAndLoss/EChartsOptionContext'
import { useGAL, useGALDispatch } from 'renderer/GainAndLoss/GALContext'
import { getDayCustom } from 'renderer/GainAndLoss/hooks/getDayCustom'
import {
  BaseDatePicker,
  IconButtonNormal,
  MySelect,
  QuarterPicker,
} from 'renderer/MyMui'
import ListAltIcon from '@mui/icons-material/ListAlt'

export const GALHeader = (props: { toggle: () => void }) => {
  const eChartsOption = useEChartsOption()
  const eChartsOptionDispatch = useEChartsOptionDispatch()
  const galDispatch = useGALDispatch()

  const fetchTrades = () => {
    window.crudAPI
      .select({
        mode: 'gal',
      })
      .then((trades) => {
        if (!trades.length) return

        galDispatch?.({ trade: trades })
        eChartsOptionDispatch?.({
          type: 'setDate',
          date: new Date(trades[trades.length - 1].date),
        })
      })
  }

  useEffect(fetchTrades, [])

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
            interval: e.target.value as GALInterval,
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
  const tradesGAL = useGAL()
  const eChartsOptionDispatch = useEChartsOptionDispatch()

  if (!tradesGAL?.length) return <div></div>

  const min = new Date(tradesGAL[0].date)
  const max = new Date(tradesGAL[tradesGAL.length - 1].date)

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
          minDate={dayjs(min)}
          maxDate={dayjs(max)}
          value={dayjs(eChartsOption.date)}
        />
      )
    case '1w':
      min.setDate(min.getDate() - getDayCustom(min))
      max.setDate(max.getDate() - getDayCustom(max))
      return (
        <QuarterPicker
          onChange={(day) => day && changeFunc(day)}
          minDate={dayjs(min)}
          maxDate={dayjs(max)}
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
          minDate={dayjs(min)}
          maxDate={dayjs(max)}
          value={dayjs(eChartsOption.date)}
        />
      )
  }
  return <div></div>
}
