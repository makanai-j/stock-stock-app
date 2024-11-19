import React, { useState } from 'react'

import { priceFormatter } from 'renderer/hooks/priceFormatter'

import { NumberInputProps } from './InputFieldProps'
import { StyledInputField } from './StyledInputField'

export const PriceInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const { value = 0, onChange, onBlur, min, max, style } = props
    let caretPos = 0
    let isDeleteKey = false

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
      onBlur?.(checkedValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStrValue = e.target.value
      const newNomValue = Number(deleteComma(newStrValue))

      if (/^[-.]$/.test(newStrValue)) return setThisValue(newStrValue)
      // 数字以外の場合は元の値を返す
      else if (isNaN(newNomValue)) return

      const [integer, decimal] = deleteComma(newStrValue).split('.')
      // 整数部はコンマ区切り
      let formattedNewStrValue = /^-?$/g.test(integer)
        ? integer
        : priceFormatter(Number(integer))
      // ドットがあれば小数を加える
      if (typeof decimal === 'string') formattedNewStrValue += `.${decimal}`

      // caret position get
      if (e.target.selectionStart) {
        caretPos = e.target.selectionStart

        const pattern = /[0-9.-]/g
        const matches = newStrValue.slice(0, caretPos).match(pattern)
        let numLength = matches ? matches.length : 0

        let countPos = 0
        for (let i = 0; i < formattedNewStrValue.length; i++) {
          if (numLength <= 0) break

          if (formattedNewStrValue[i].match(pattern)) numLength -= 1
          countPos++
        }

        // deleteへの対応
        // カンマは無敵状態としてcaretを移動させるだけにする
        const preCommaNum = thisValue.match(/,/g)?.length || 0
        const newCommaNum = newStrValue.match(/,/g)?.length || 0
        if (isDeleteKey) countPos += preCommaNum > newCommaNum ? 1 : 0

        caretPos = countPos
      }

      // textfield update
      setThisValue(formattedNewStrValue)

      onChange?.(newNomValue)

      // caret position change
      const orgColor = e.target.style.caretColor
      e.target.style.caretColor = 'transparent'

      // caret position set
      setTimeout(() => {
        e.target.focus()
        e.target.setSelectionRange(caretPos, caretPos)

        e.target.style.caretColor = orgColor
      }, 1)
    }

    return (
      <StyledInputField
        ref={ref}
        value={thisValue}
        style={style}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          isDeleteKey = e.key === 'Delete'
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    )
  }
)
