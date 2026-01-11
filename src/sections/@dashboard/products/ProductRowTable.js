
import React, { useEffect, useState } from 'react';
import { Modal } from '@material-ui/core';
import {
  Box,
  TableCell,
  TableRow,
  Typography,
  Collapse,
  IconButton,
  CardMedia,
  Button,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Swal from 'sweetalert2';
import { deleteProduct, getSubProducts } from 'src/api';

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SubProduct from './SubProduct';
import AddSubProduct from './AddSubProduct';
import EditProduct from './EditProduct';

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

export default function ProductRowTable({ row, index, group, setUpdate, update }) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [addNew, setAddNew] = useState(false)
  const handleDeleteProduct = (row, setUpdate, update) => {
    Swal.fire({
      text: `Are you sure you want to delete product ${row.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteProduct(row.id_product)
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
  const [subList, setSubList] = useState([])
  useEffect(() => {
    async function fetchData() {
      const productLists = await getSubProducts()
      if (productLists.results) {
        const subProduct = productLists.results.filter((sub) => sub.id_product == row.id_product)
        setSubList(subProduct)
        // setProductListTemp(productLists.results)
      }
    }
    fetchData();

  }, [update])
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
          {index + 1}
        </TableCell>
        <TableCell align="center" sx={{ width: 100 }}>
          {row.name}
        </TableCell>
        <TableCell align="center" sx={{ width: 100 }}>
          {group}
        </TableCell>
        <TableCell align="center" sx={{ width: 150 }}>
          {
            row.brochure &&
            <a href={row.brochure} target='_blank'>
              Open link
            </a>
          }
        </TableCell>
        <TableCell align="center" sx={{ width: 200 }}>
          <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={`https://api.mmsvn.com/read_image/${row.image}`}
            alt={row.name}
          />
        </TableCell>
        
        <TableCell align="center" sx={{ width: 200 }}>
          <Button variant="text" onClick={() => { setOpenModal(true) }}>Show sub product ({subList.length})</Button>
          <Modal
            open={openModal}
            onClose={() => { setOpenModal(false) }}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style }}>
              <Box>
                <Typography variant="h4" p={2} sx={{ display: 'inline-block' }}>Sub product {row.name}</Typography>
                <Button variant="contained" onClick={() => { setAddNew(true) }} sx={{ marginBottom: '8px' }} startIcon={<AddIcon />}>
                  New sub product
                </Button>
                <IconButton aria-label="close" color="error" sx={{ margin: '10px', float: 'right' }} onClick={() => { setOpenModal(false) }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ maxHeight: 700, minHeight: 500, overflowY: "auto" }}>
                {
                  !addNew &&
                  <SubProduct row={row} setUpdate={setUpdate} update={update} subList={subList} />
                }
                {
                  addNew &&
                  <Box>

                    <AddSubProduct row={row} setUpdate={setUpdate} update={update} handleDeleteProduct={handleDeleteProduct} setOpen={setAddNew} />
                  </Box>
                }
              </Box>
            </Box>
          </Modal>
          {/* {fDate(row.edit_date ? row.edit_date : row.cre_date)} */}
        </TableCell>
        <TableCell align="center" sx={{ width: 200 }}>
          <Button variant="text" onClick={() => { setOpen(true) }}>Update</Button>
          {
            !(subList?.length > 0) &&
            <Button variant="text" color="error" onClick={() => { handleDeleteProduct(row, setUpdate, update) }}>Delete</Button>
          }
        </TableCell>
      </TableRow>
      <TableRow style={{ borderLeft: (open ? "2px solid #6366f1" : "unset") }}>
        <TableCell align="center" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <EditProduct subList={subList} row={row} setOpen={setOpen} setUpdate={setUpdate} update={update} handleDeleteProduct={handleDeleteProduct} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}