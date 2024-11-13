import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')
import { BaseDatePicker } from './BaseDatePicker'
import { QuarterPicker } from './QuarterPicker'
import { MyDateTimePicker } from './MyDateTimePicker'
import { IconButtonNormal } from './MyIconButton'
import { IconButtonCancel } from './MyIconButton'
import { IconButtonComplete } from './MyIconButton'
import { MyTextField } from './MyTextField'
import { MySelect } from './MySelect'

export {
  MyDateTimePicker,
  BaseDatePicker,
  QuarterPicker,
  IconButtonNormal,
  IconButtonCancel,
  IconButtonComplete,
  MyTextField,
  MySelect,
}

/*
<QuarterPicker />
<MyDateTimePicker format="YYYY/M/D H:m" />
<BaseDatePicker
  format="YYYY/M"
  formatDensity="spacious"
  views={['year', 'month']}
  slotProps={{
    calendarHeader: { format: 'YYYY/M' },
  }}
/>
<BaseDatePicker
  format="YYYY"
  formatDensity="spacious"
  closeOnSelect={true}
  // calendar header を表示するために2つ入れる
  views={['year', 'year']}
  slotProps={{
    calendarHeader: { format: 'YYYY' },
  }}
/>

*/
