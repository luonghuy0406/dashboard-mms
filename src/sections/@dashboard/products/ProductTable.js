import React from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import ProductRowTable from './ProductRowTable';

export default function ProductsTable(props) {
  const {
    items = [],
    productGroup,
    setUpdate,
    update
  } = props;
  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell align="center">
                <></>
              </TableCell>
              <TableCell align="center">
                <></>
              </TableCell>
              <TableCell align="center" >Product name</TableCell>
              <TableCell align="center" >Product line</TableCell>
              <TableCell align="center" >Brochure</TableCell>
              <TableCell align="center" >Product cover</TableCell>
              {/* <TableCell align="center" >Product description VI</TableCell>
              <TableCell align="center" >Product description EN</TableCell>
              <TableCell align="center" >Product spec VI</TableCell>
              <TableCell align="center" >Product spec EN</TableCell> */}
              <TableCell align="center" >Sub product</TableCell>
              <TableCell align="center" >Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row, index) => {
              return (
                <ProductRowTable index={index} key={"table" + row.id_product} row={row} group={productGroup[row.id_group]} setUpdate={setUpdate} update={update} />
              )
            }
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};



