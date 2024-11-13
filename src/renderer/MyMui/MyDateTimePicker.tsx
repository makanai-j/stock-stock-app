import './style.css'
import { DateTextField } from './DateTextFIeld'
import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { StyledEngineProvider } from '@mui/material'
import { Dayjs } from 'dayjs'
import React from 'react'

export const MyDateTimePicker = React.forwardRef(
  (props: DateTimePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            {...props}
            ampm={false}
            timeSteps={{ minutes: 1 }}
            slotProps={{
              field: { shouldRespectLeadingZeros: true },
              actionBar: { actions: [] },
              calendarHeader: { format: 'YYYY / M' },
            }}
            slots={{ textField: DateTextField }}
          />
        </LocalizationProvider>
      </StyledEngineProvider>
    )
  }
)
