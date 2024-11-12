import {
  DateValidationError,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers'
import dayjs from 'dayjs'

type MyDatePickerProps<T> = {
  min?: dayjs.Dayjs
  max?: dayjs.Dayjs
  onChange?: (
    value: dayjs.Dayjs | null,
    context: PickerChangeHandlerContext<T>
  ) => void
  value?: dayjs.Dayjs | null
}
