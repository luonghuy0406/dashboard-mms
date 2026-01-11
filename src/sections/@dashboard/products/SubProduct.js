import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

import RowSubProduct from './RowSubProduct';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  p: 2,
  pt: 0,
  borderRadius: '4px',
  width: '90%'
}

export default function SubProduct({ row, setUpdate, update, handleDeleteProduct, subList }) {
  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell align="center">
                <></>
              </TableCell>
              <TableCell align="center" >Product name</TableCell>
              <TableCell align="center" >Product cover</TableCell>
              <TableCell align="center" >Product description VI</TableCell>
              <TableCell align="center" >Product description EN</TableCell>
              <TableCell align="center" >Product spec VI</TableCell>
              <TableCell align="center" >Product spec EN</TableCell>
              <TableCell align="center" >Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subList.map((sub) => {
              return (
                <RowSubProduct key={sub.id_sub} row={sub} setUpdate={setUpdate} update={update} />
              )
            }
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  )
}