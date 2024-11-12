import * as React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { Dayjs } from 'dayjs'
import MyTextField from './MyTextFIeld'
import './style.css'
import { StyledEngineProvider } from '@mui/material/styles'

export const BaseDatePicker = React.forwardRef(
  (props: DatePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <StyledEngineProvider injectFirst>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          dateFormats={{ year: 'YYYY', monthShort: 'M' }}
        >
          <DatePicker
            {...props}
            openTo="year"
            yearsOrder="asc"
            slotProps={{
              ...props.slotProps,
              field: { shouldRespectLeadingZeros: true },
            }}
            slots={{ ...props.slots, textField: MyTextField }}
          />
        </LocalizationProvider>
      </StyledEngineProvider>
    )
  }
)
