import { useEffect, useState } from 'react'
import { GALProvider, useGAL, useGALDispatch } from './GALContext'
import { GALList } from './components/GALList'
import { GALChart } from './components/GALCharts'
import {
  EChartsOptionProvider,
  useEChartsOption,
  useEChartsOptionDispatch,
} from './EChartsOptionContext'
import { getDayCustom } from './hooks/getDayCustom'

export const GainAndLoss = () => {
  return (
    <>
      <GALProvider>
        <EChartsOptionProvider>
          <SetGAL></SetGAL>
          <GALChart></GALChart>
          <GALList></GALList>
        </EChartsOptionProvider>
      </GALProvider>
    </>
  )
}

const SetGAL = () => {
  const galDispatch = useGALDispatch()
  const eChartsOptionDispatch = useEChartsOptionDispatch()

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
    <>
      <select
        onChange={(e) =>
          eChartsOptionDispatch &&
          eChartsOptionDispatch({
            type: 'setInterval',
            interval: e.target.value as GALInterval,
          })
        }
      >
        <option value="1d">日</option>
        <option value="1w">週</option>
        <option value="1mo">月</option>
        <option value="1y">年</option>
      </select>
      <SelectDate
        changeFunc={(e) => {
          eChartsOptionDispatch &&
            eChartsOptionDispatch({
              type: 'setDate',
              date: new Date(e.target.value),
            })
        }}
      ></SelectDate>
    </>
  )
}

const SelectDate = ({
  changeFunc,
}: {
  changeFunc: (e: React.ChangeEvent<any>) => void
}) => {
  const eChartsOption = useEChartsOption()
  const tradesGAL = useGAL()

  if (!tradesGAL?.length) return <div></div>

  const min = new Date(tradesGAL[0].date)
  const max = new Date(tradesGAL[tradesGAL.length - 1].date)

  const getYearMonth = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

  switch (eChartsOption?.interval) {
    case '1d':
      return (
        <input
          type="month"
          onChange={changeFunc}
          min={getYearMonth(min)}
          max={getYearMonth(max)}
          value={getYearMonth(eChartsOption.date)}
        ></input>
      )
    case '1w':
      min.setDate(min.getDate() - getDayCustom(min))
      max.setDate(max.getDate() - getDayCustom(max))
      return (
        <input
          type="month"
          onChange={changeFunc}
          min={getYearMonth(min)}
          max={getYearMonth(max)}
          value={getYearMonth(eChartsOption.date)}
        ></input>
      )
    case '1mo':
      return (
        <select value={eChartsOption.date.getFullYear()} onChange={changeFunc}>
          {[...Array(max.getFullYear() + 1 - min.getFullYear()).keys()].map(
            (i) => {
              const year = i + min.getFullYear()
              return <option value={year} key={year}>{`${year}年`}</option>
            }
          )}
        </select>
      )
  }
  return <div></div>
}
