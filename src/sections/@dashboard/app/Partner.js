import React from 'react'
import { Card, Typography, Box, Table, TableHead, TableRow, TableCell, CardMedia, TableBody, Button, Collapse, Stack, Paper, styled, Modal, IconButton, FormControl, FormHelperText, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { addNewCustomer, deleteCustomer, getCustomer, updateCustomer } from 'src/api';
import Iconify from 'src/components/iconify/Iconify';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';

export default function Customer() {
    const [customers, setCustomers] = useState([])
    const [update, setUpdate] = useState(false)
    const [open, setOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [add, setAdd] = useState(true)
    const [id, setId] = useState('')
    useEffect(() => {
        async function fetchData() {
            const customer = await getCustomer()
            if (customer.results) {
                setCustomers(customer.results)
            }
        }
        fetchData();

    }, [update])
    function handleDelete(row, update, setUpdate) {
        Swal.fire({
            text: `Are you sure you want to delete customer ${row.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteCustomer(row.id)
                if (response.results.status == 'success') {
                    setOpenModal(false)
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
            <Stack direction="row" spacing={2} mb={3}>

                <Typography variant="h4">Customer</Typography>
                <Button variant="text" onClick={() => { setOpen(!open) }}>{open ? 'Hide' : 'Show'}</Button>
            </Stack>
            <Box sx={{ minWidth: 800 }}>

                <Collapse in={open}>

                    <Box sx={{ width: '100%' }}>
                        <Button
                            variant="contained"
                            sx={{ float: 'right', m: 2 }}
                            onClick={() => {
                                setOpenModal(true)
                                setAdd(true)
                            }}
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            Add new
                        </Button>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Image</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {customers.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 350, textAlign: "center" }}
                                                    image={`https://api.mmsvn.com/read_image/${row.image}`}
                                                    alt={row.name}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="text"
                                                onClick={() => {
                                                    setOpenModal(true)
                                                    setAdd(false)
                                                    setId(row.id)
                                                }}
                                            >Update</Button>
                                            <Button variant="text" color="error" onClick={() => { handleDelete(row, update, setUpdate) }}>Delete</Button>



                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Modal
                            open={openModal}
                            onClose={() => { setOpenModal(false) }}
                            aria-labelledby="parent-modal-title"
                            aria-describedby="parent-modal-description"
                        >
                            <ModalAdd add={add} setOpenModal={setOpenModal} customers={customers} id={id} update={update} setUpdate={setUpdate} />
                        </Modal>
                    </Box>
                </Collapse>
            </Box>
        </>

    )
}

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
const ModalAdd = ({ add, setOpenModal, customers, id = '', update, setUpdate }) => {
    if (id) {
        customers = customers.filter((customer) => customer.id == id)
    }
    const [name, setName] = useState(add ? '' : customers[0].name)
    const [image, setImage] = useState(add ? '' : `https://api.mmsvn.com/read_image/${customers[0].image}`)
    const [imageFile, setImageFile] = useState('')
    useEffect(() => {
        if (customers?.length > 0) {
            toDataURL(`https://api.mmsvn.com/read_image/${customers[0].image}`)
                .then(dataUrl => {
                    var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
                    setImageFile(fileData)
                })
        }
    }, [id])
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file))

    };
    const handleAddNew = async (name, image, id, update, add, customers, file) => {
        if (name && image) {
            const imageFile = document.getElementById("file-upload-new-customer" + id).files[0] || file
            if (add) {
                const response = await addNewCustomer(name, imageFile)
                Swal.fire(
                    response.results.status,
                    response.results.msg,
                    response.results.status
                )
                setOpenModal(false)
                setUpdate(!update)
                handleCancel(add, id, customers)
            } else {
                const response = await updateCustomer(id, name, imageFile)
                Swal.fire(
                    response.results.status,
                    response.results.msg,
                    response.results.status
                )
                setOpenModal(false)
                setUpdate(!update)
                handleCancel(add, id, customers)
            }
        }
    }
    const handleCancel = (add, id, customers) => {
        if (add) {
            setName('')
            setImage('')
            document.getElementById("file-upload-new-customer" + id).value = ''
        } else {
            setName(add ? '' : customers[0].name)
            setImage(add ? '' : `https://api.mmsvn.com/read_image/${customers[0].image}`)
            document.getElementById("file-upload-new-customer" + id).value = ''
        }
        setOpenModal(false)
    }
    return (
        <Box sx={{ ...style }}>
            <Box>
                <Typography variant="h4" p={2} sx={{ display: 'inline-block' }}>{add ? 'New customer' : 'Edit customer'}</Typography>
                <IconButton aria-label="close" color="error" sx={{ margin: '10px', float: 'right' }} onClick={() => { setOpenModal(false) }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ maxHeight: 700, minHeight: 500, overflowY: "auto" }}>

                <Stack mb={5}>
                    <Card sx={{ p: 2 }}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                                <Typography variant="h6" gutterBottom>
                                    Customer name
                                </Typography>
                                <FormControl required={true} fullWidth={true}>
                                    <TextField
                                        required
                                        variant='standard'
                                        name={"customer_name"}
                                        onChange={(e) => { setName(e.target.value) }}
                                        error={name?.length == 0}
                                        value={name}
                                        helperText={name?.length == 0 ? "Name cannot be empty" : ""}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                    </Card>
                </Stack>
                <Stack mb={5} >
                    <Card sx={{ p: 2 }}>
                        <Stack mb={5} sx={{ alignItems: "center" }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="baseline"
                                spacing={2}
                                sx={{ width: '100%' }}
                            >
                                <h3>Image</h3>
                                <div>
                                    <input
                                        accept="image/*"
                                        id={"file-upload-new-customer" + id}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleImageUpload(e) }}
                                    />

                                    <label htmlFor={"file-upload-new-customer" + id}>
                                        <Button variant="text" color="primary" component="span">
                                            {image ? "Replace image" : "Upload image"}
                                        </Button>
                                    </label>
                                </div>
                            </Stack>
                            <Stack mb={2} sx={{ alignItems: "center" }}>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 200, height: 200, textAlign: "center" }}
                                        image={`${image}`}
                                        alt={name}
                                    />
                                </Box>
                            </Stack>

                            <Stack sx={{ alignItems: "center" }}>
                                {
                                    !image &&
                                    <FormHelperText error>
                                        Please upload image.
                                    </FormHelperText>
                                }
                            </Stack>

                        </Stack>
                    </Card>
                </Stack>

                <Stack sx={{ m: 2 }} spacing={2} direction="row" justifyContent="end">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={() => { handleAddNew(name, image, id, update, add, customers, imageFile) }}>Save</Button>
                        <Button variant="text" style={{ color: "gray" }} onClick={() => { handleCancel(add, id, customers) }}>Cancel</Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}


const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))



function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

