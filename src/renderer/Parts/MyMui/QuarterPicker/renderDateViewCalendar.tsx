/**
 * 変更
 */
import { DateCalendarProps } from '@mui/x-date-pickers'
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models'
import { isDatePickerView } from '@mui/x-date-pickers/internals/utils/date-utils'
import { DateView, PickerValidDate } from '@mui/x-date-pickers/models'
import * as React from 'react'

import { DateCalendar } from './DateCalendar'

export interface DateViewRendererProps<
  TDate extends PickerValidDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends Omit<
    DateCalendarProps<TDate>,
    'views' | 'openTo' | 'view' | 'onViewChange' | 'focusedView'
  > {
  view: TView
  onViewChange?: (view: TView) => void
  views: readonly TView[]
  focusedView: TView | null
}

export const renderDateViewCalendar = <TDate extends PickerValidDate>({
  view,
  onViewChange,
  views,
  focusedView,
  onFocusedViewChange,
  value,
  defaultValue,
  referenceDate,
  onChange,
  className,
  classes,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  reduceAnimations,
  onMonthChange,
  monthsPerRow,
  onYearChange,
  yearsOrder,
  yearsPerRow,
  slots,
  slotProps,
  loading,
  renderLoading,
  disableHighlightToday,
  readOnly,
  disabled,
  showDaysOutsideCurrentMonth,
  dayOfWeekFormatter,
  sx,
  autoFocus,
  fixedWeekNumber,
  displayWeekNumber,
  timezone,
}: DateViewRendererProps<TDate, DateView>) => (
  <DateCalendar
    view={view}
    onViewChange={onViewChange}
    views={views.filter(isDatePickerView)}
    focusedView={
      focusedView && isDatePickerView(focusedView) ? focusedView : null
    }
    onFocusedViewChange={onFocusedViewChange}
    value={value}
    defaultValue={defaultValue}
    referenceDate={referenceDate}
    onChange={onChange}
    className={className}
    classes={classes}
    disableFuture={disableFuture}
    disablePast={disablePast}
    minDate={minDate}
    maxDate={maxDate}
    shouldDisableDate={shouldDisableDate}
    shouldDisableMonth={shouldDisableMonth}
    shouldDisableYear={shouldDisableYear}
    reduceAnimations={reduceAnimations}
    onMonthChange={onMonthChange}
    monthsPerRow={monthsPerRow}
    onYearChange={onYearChange}
    yearsOrder={yearsOrder}
    yearsPerRow={yearsPerRow}
    slots={slots}
    slotProps={slotProps}
    loading={loading}
    renderLoading={renderLoading}
    disableHighlightToday={disableHighlightToday}
    readOnly={readOnly}
    disabled={disabled}
    showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
    dayOfWeekFormatter={dayOfWeekFormatter}
    sx={sx}
    autoFocus={autoFocus}
    fixedWeekNumber={fixedWeekNumber}
    displayWeekNumber={displayWeekNumber}
    timezone={timezone}
  />
)
