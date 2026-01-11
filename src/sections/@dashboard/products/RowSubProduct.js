import React, { useEffect, useState } from 'react';
import { Modal } from '@material-ui/core';
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  IconButton,
  CardMedia,
  TextField,
  Button,
  Divider,
  Grid
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditorComponent from './EditorComponent';
import Swal from 'sweetalert2';
import { deleteSubProduct, getSubProducts } from 'src/api';

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditSubProduct from './EditSubProduct';

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

export default function RowSubProduct({ row, setUpdate, update }) {
  const [open, setOpen] = useState(false);
  const handleDeleteSubProduct = (row, setUpdate, update) => {
    Swal.fire({
      text: `Are you sure you want to delete product ${row.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteSubProduct(row.id_sub)
        if (response.results.status == 'success') {
          setOpen(false)
          setUpdate(!update)
        }
        Swal.fire(
          response.results.status,
          response.results.msg,
          response.results.status
        )
      }
    })
  }
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} style={{ borderLeft: (open ? "2px solid #6366f1" : "unset") }}>
        <TableCell align="center" sx={{ width: 30 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" sx={{ width: 100 }}>
          {row.name}
        </TableCell>
        <TableCell align="center" sx={{ width: 200 }}>
          <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={`https://api.mmsvn.com/read_image/${row.image}`}
            alt={row.name}
          />
        </TableCell>
        <TableCell align="center" sx={{ width: 300 }}>
          <div
            style={{
              'overflow': 'hidden',
              'display': '-webkit-box',
              'WebkitLineClamp': '6', /* number of lines to show */
              'lineClamp': '6',
              'WebkitBoxOrient': 'vertical'
            }}
            className='ck-content'
            dangerouslySetInnerHTML={{ __html: row.content }}
          />
        </TableCell>
        <TableCell align="center" sx={{ width: 300 }}>
          <div
            className='ck-content'
            style={{
              'overflow': 'hidden',
              'display': '-webkit-box',
              'WebkitLineClamp': '6', /* number of lines to show */
              'lineClamp': '6',
              'WebkitBoxOrient': 'vertical'
            }}
            dangerouslySetInnerHTML={{ __html: row.content_en }}
          />
        </TableCell>
        <TableCell align="center" sx={{ width: 200 }}>
          <Button variant="text" onClick={() => { setOpen(true) }}>Update</Button>
          <Button variant="text" color="error" onClick={() => { handleDeleteSubProduct(row, setUpdate, update) }}>Delete</Button>
        </TableCell>
      </TableRow>
      <TableRow style={{ borderLeft: (open ? "2px solid #6366f1" : "unset") }}>
        <TableCell align="center" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <EditSubProduct row={row} setOpen={setOpen} setUpdate={setUpdate} update={update} handleDeleteSubProduct={handleDeleteSubProduct} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}