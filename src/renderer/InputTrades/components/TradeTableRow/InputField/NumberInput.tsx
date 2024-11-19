import React, { useState } from 'react'

import { NumberInputProps } from './InputFieldProps'
import { StyledInputField } from './StyledInputField'

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value = 0, onChange, onBlur, min, max, style } = props

    const getChackedMinMaxValue = (targetValue: number | '-') => {
      if (targetValue == '-') return 0
      if (min !== undefined && targetValue < min) return min
      if (max !== undefined && targetValue > max) return max
      return targetValue
    }

    const [thisValue, setThisValue] = useState<string>(
      getChackedMinMaxValue(value).toString()
    )

    // `value`が変更されたときに`thisValue`を更新
    // useEffect(() => {
    //   const checkedValue = getChackedMinMaxValue(value)
    //   setThisValue(checkedValue)
    //   onChange && onChange(checkedValue)
    // }, [value])

    return (
      <StyledInputField
        ref={ref}
        value={thisValue}
        style={style}
        onFocus={(e) => e.target.select()}
        onBlur={() => {
          const numberValue = Number(thisValue)
          if (isNaN(numberValue)) {
            setThisValue('0')
            onBlur?.(0)
            return
          }
          const checkedValue = getChackedMinMaxValue(numberValue)
          setThisValue(checkedValue.toString())
          onBlur?.(checkedValue)
        }}
        onChange={(e) => {
          if (!e) return
          const newValue = Number(e.target.value)

          if (e.target.value === '-') setThisValue('-')
          // else if (!isNaN(newValue)) setThisValue(newValue)
          else if (!isNaN(newValue)) {
            setThisValue(
              newValue +
                (e.target.value[e.target.value.length - 1] == '.' ? '.' : '')
            )
            onChange?.(newValue)
          }
        }}
      />
    )
  }
)
