import React, { useState } from 'react'

import { priceFormatter } from 'renderer/hooks/priceFormatter'

import { NumberInputProps } from './InputFieldProps'
import { StyledInputField } from './StyledInputField'

export const PriceInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value = 0, onChange, min, max, style } = props
    let caretPos = 0

    const getCheckedMinMaxValue = (targetValue: number) => {
      if (min !== undefined && targetValue < min) return min
      if (max !== undefined && targetValue > max) return max
      return targetValue
    }

    const checkedAndFormattedValue = (targetValue: number) => {
      return priceFormatter(getCheckedMinMaxValue(targetValue))
    }

    const [thisValue, setThisValue] = useState(checkedAndFormattedValue(value))

    // `value`が変更されたときに`thisValue`を更新
    // useEffect(() => {

    //   setThisValue(checkedAndFormattedValue(value))
    // }, [value])

    const deleteComma = (str: string) => {
      return str.replace(/,/g, '')
    }

    const handleBlur = () => {
      const parsedValue = Number(deleteComma(thisValue))
      const checkedValue = getCheckedMinMaxValue(
        isNaN(parsedValue) ? 0 : parsedValue
      )
      setThisValue(priceFormatter(checkedValue))
      onChange?.(checkedValue)
    }

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const newStrValue = e.currentTarget.value
      const newNomValue = Number(deleteComma(newStrValue))

      // 数字以外の場合は値を変更せず返す
      if (e.currentTarget.value === '-') return setThisValue('-')
      else if (isNaN(newNomValue)) return

      const formattedNewStrValue =
        priceFormatter(newNomValue) +
        (newStrValue[newStrValue.length - 1] == '.' ? '.' : '')

      // caret position get
      if (e.currentTarget.selectionStart) {
        caretPos = e.currentTarget.selectionStart
        console.log(caretPos)

        const pattern = /[0-9.-]/g
        const matches = newStrValue.slice(0, caretPos).match(pattern)
        let numLength = matches ? matches.length : 0

        let countPos = 0
        for (let i = 0; i < formattedNewStrValue.length; i++) {
          if (numLength <= 0) break

          if (formattedNewStrValue[i].match(pattern)) numLength -= 1
          countPos++
        }

        caretPos = countPos
      }
      // textfield update
      setThisValue(formattedNewStrValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.style.caretColor = 'transparent'

      // caret position set
      setTimeout(() => {
        console.log(e.target.selectionStart)
        e.target.focus()
        e.target.setSelectionRange(caretPos, caretPos)

        e.target.style.caretColor = 'white'
      }, 1)
    }

    return (
      <StyledInputField
        ref={ref}
        value={thisValue}
        style={style}
        onFocus={(e) => e.target.select()}
        onBlur={handleBlur}
        onInput={handleInput}
        onChange={handleChange}
      />
    )
  }
)
