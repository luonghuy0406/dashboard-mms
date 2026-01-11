import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  CardMedia,
  TextField,
  Button,
  Divider,
  Grid,
  FormControl
} from '@mui/material';
import EditorComponent from './EditorComponent';
import { updateSubProduct } from 'src/api';
import Swal from 'sweetalert2';

export default function EditSubProduct({ row, setOpen, setUpdate, update, handleDeleteProduct }) {
  const [name, setName] = useState(row.name)
  const [image, setImage] = useState(`https://api.mmsvn.com/read_image/${row.image}`)
  const [content, setContent] = useState(row.content)
  const [content_en, setContentEN] = useState(row.content_en)
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file))

  };
  const handleUpdateProduct = async (id, name, content, content_en, id_product) => {
    if (name?.length > 0) {
      let image = document.getElementById("file-upload-sub-product" + id).files[0]
      const response = await updateSubProduct(id, name, content, content_en, image || '', id_product)
      Swal.fire(
        response.results.status,
        response.results.msg,
        response.results.status
      )
      if (response.results.status == 'success') {
        setOpen(false)
        setUpdate(!update)
        handleCancel(id)
      }
    }
  }

  const handleCancel = (id) => {
    setName(row.name)
    setImage(`https://api.mmsvn.com/read_image/${row.image}`)
    setContent(row.content)
    setContentEN(row.content_en)
    setOpen(false)
    document.getElementById("file-upload-sub-product" + id).value = ''
  }
  return (
    <Box sx={{ margin: 3 }}>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="h6" gutterBottom component="div">
            Edit product
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 2 },
            }}
            noValidate
            autoComplete="off"
          >

            <FormControl required={true} fullWidth={true}>
              <TextField
                required
                name={"product_name" + row.id_sub}
                onChange={(e) => { setName(e.target.value) }}
                error={name?.length == 0}
                value={name}
                helperText={name?.length == 0 ? "Name cannot be empty" : ""}
              />
            </FormControl>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              spacing={2}
              sx={{ width: '100%' }}
            >
              <h3>Product Cover</h3>
              <div>
                <input
                  accept="image/*"
                  id={"file-upload-sub-product" + row.id_sub}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => { handleImageUpload(e) }}
                />

                <label htmlFor={"file-upload-sub-product" + row.id_sub}>
                  <Button variant="text" color="primary" component="span">
                    Replace image
                  </Button>
                </label>
              </div>
            </Stack>
            <Stack mb={5} sx={{ alignItems: "center" }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
              >

                <CardMedia
                  component="img"
                  sx={{ width: 200, height: 200, textAlign: "center" }}
                  image={`${image}`}
                  alt="about 1"
                />
              </Box>
            </Stack>
            <h3 style={{ textAlign: "left" }}>Product description VI</h3>

            <EditorComponent des={content} setDes={setContent} />
            <h3 style={{ textAlign: "left" }}>Product description EN</h3>

            <EditorComponent des={content_en} setDes={setContentEN} />

          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Stack sx={{ m: 2 }} spacing={2} direction="row" justifyContent="space-between">
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={() => { handleUpdateProduct(row.id_sub, name, content, content_en, row.id_product) }}>Update</Button>
          <Button variant="text" style={{ color: "gray" }} onClick={() => { handleCancel(row.id_sub) }}>Cancel</Button>
        </Stack>
        <Button variant="text" color="error" onClick={() => { handleDeleteProduct(row, setUpdate, update) }}>Delete product</Button>
      </Stack>
    </Box>
  )
}