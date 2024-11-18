import React, { useState } from 'react'

import { priceFormatter } from 'renderer/hooks/priceFormatter'

import { NumberInputProps } from './InputFieldProps'
import { StyledInputField } from './StyledInputField'

export const PriceInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value = 0, onChange, min, max, style } = props

    const getChackedMinMaxValue = (targetValue: number) => {
      if (min !== undefined && targetValue < min) return min
      if (max !== undefined && targetValue > max) return max
      return targetValue
    }

    const checkedAndFormattedValue = (targetValue: number) => {
      return priceFormatter(getChackedMinMaxValue(targetValue))
    }

    const [thisValue, setThisValue] = useState(checkedAndFormattedValue(value))

    // `value`が変更されたときに`thisValue`を更新
    // useEffect(() => {

    //   setThisValue(checkedAndFormattedValue(value))
    // }, [value])

    const deleteComma = (str: string) => {
      return Number(str.replace(/,/g, ''))
    }

    return (
      <StyledInputField
        ref={ref}
        value={thisValue}
        style={style}
        onFocus={(e) => e.target.select()}
        onBlur={() => {
          let newValue = deleteComma(thisValue)
          if (isNaN(newValue)) {
            setThisValue('0')
            onChange && onChange(0)
          } else {
            newValue = getChackedMinMaxValue(newValue)
            setThisValue(priceFormatter(newValue))
            onChange && onChange(newValue)
          }
        }}
        onChange={(e) => {
          if (!e) return
          const newValue = deleteComma(e.target.value)

          if (e.target.value === '-') setThisValue('-')
          else if (!isNaN(newValue)) setThisValue(priceFormatter(newValue))
        }}
      />
    )
  }
)
