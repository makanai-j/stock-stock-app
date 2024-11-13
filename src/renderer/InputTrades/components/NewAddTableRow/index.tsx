import {
  IconButtonCancel,
  MyDateTimePicker,
  MySelect,
  MyTextField,
} from 'renderer/MyMui'
import { MenuItem, TableRow } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { MyNumberField } from 'renderer/MyMui/MyNumberField'
import { StyledTableCell } from '../StyledTableCell'

export const NewAddTableRow = ({
  onClickAdd,
}: {
  onClickAdd: (target: string) => void
}) => {
  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      {/* copy add */}
      <StyledTableCell></StyledTableCell>
      {/* group */}
      <StyledTableCell></StyledTableCell>
      {/**
       * datetime
       * numberで保存することで、sqlとjsでの違いをなくす
       */}
      <StyledTableCell onClick={() => onClickAdd('')}>
        <MyDateTimePicker format="YYYY/M/D H:m" disabled={true} />
      </StyledTableCell>
      {/** symbol */}
      <StyledTableCell onClick={() => onClickAdd('')}>
        <MyTextField
          helperText="コード"
          sx={{ width: '80px' }}
          disabled={true}
        />
      </StyledTableCell>
      {/** tradetype */}
      <StyledTableCell>
        <MySelect>
          {[
            '現物買',
            '現物売',
            '信用新規買',
            '信用新規売',
            '信用返済買',
            '信用返済売',
          ].map((type) => (
            <MenuItem
              value={type}
              key={type}
              sx={{ fontSize: '13px' }}
              disabled={true}
            >
              {type}
            </MenuItem>
          ))}
        </MySelect>
      </StyledTableCell>
      {/** quantity */}
      <StyledTableCell onClick={() => onClickAdd('')}>
        <MyNumberField
          sx={{ width: '100px' }}
          helperText="株数"
          disabled={true}
        />
      </StyledTableCell>
      {/** price fee tax */}
      {['値段', '手数料', '税金'].map((field) => (
        <StyledTableCell key={field} onClick={() => onClickAdd('')}>
          <MyNumberField
            sx={{ width: '100px' }}
            helperText={field}
            disabled={true}
          />
        </StyledTableCell>
      ))}
      {/** holdtype */}
      <StyledTableCell>
        <MySelect disabled={true}>
          {['一般', '特定', 'NISA'].map((type) => (
            <MenuItem value={type} key={type} sx={{ fontSize: '13px' }}>
              {type}
            </MenuItem>
          ))}
        </MySelect>
      </StyledTableCell>
      <StyledTableCell>
        <IconButtonCancel
          aria-label="delete"
          size="small"
          sx={{ color: 'rgb(220,100,100)' }}
          disabled={true}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButtonCancel>
      </StyledTableCell>
    </TableRow>
  )
}
