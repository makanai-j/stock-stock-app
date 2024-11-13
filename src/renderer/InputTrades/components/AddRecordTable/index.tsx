import { useState } from 'react'
import './index.css'
import { useInputTradesDispatch } from 'renderer/InputTrades/InputTradesContext'
import HashStr from 'renderer/InputTrades/hooks/Hash11'
import { MyDateTimePicker, MySelect, MyTextField } from 'renderer/MyMui'
import {
  MenuItem,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { IconButtonNormal, IconButtonCancel } from 'renderer/MyMui'
import dayjs from 'dayjs'
import { MyNumberField } from 'renderer/MyMui/MyNumberField'
import { TradeTabledRow } from '../TradeTableRow'
import { StyledTableCell } from '../StyledTableCell'
import { NewAddTableRow } from '../NewAddTableRow'

export const AddRecordTable = (props: { tradeGroups: TradeRecord[][] }) => {
  return (
    <TableContainer sx={{ height: 'calc(100vh - 112px)' }}>
      <Table stickyHeader>
        <AddRecordHead />
        <TableBody>
          {props.tradeGroups.map((trades) =>
            trades.map((trade, index) => (
              <TradeTabledRow
                key={`${trade.id}-${index}`}
                trade={trade}
                index={index}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const AddRecordHead = () => {
  return (
    <TableHead>
      <TableRow>
        {/* add */}
        <StyledTableCell>
          <div style={{ maxHeight: '24px', textAlign: 'center' }}>
            <IconButtonNormal sx={{ padding: 0, marginBottom: '3px' }}>
              <HelpOutlineIcon
                fontSize="small"
                sx={{ color: '#aaf', padding: '2px' }}
              />
            </IconButtonNormal>
          </div>
        </StyledTableCell>
        {/* group */}
        <StyledTableCell></StyledTableCell>
        {[
          '日時',
          'コード',
          '取引',
          '株数',
          '値段',
          '手数料',
          '税金',
          '口座',
        ].map((headCell) => (
          <StyledTableCell
            key={headCell}
            align="center"
            padding="none"
            sx={{ color: 'white' }}
          >
            {headCell}
          </StyledTableCell>
        ))}
        {/* delete */}
        <StyledTableCell></StyledTableCell>
      </TableRow>
    </TableHead>
  )
}
