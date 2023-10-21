import React, { useState} from 'react';
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
import { updateProduct } from 'src/api';
import Swal from 'sweetalert2';

export default function EditProduct ({subList, row, setOpen, setUpdate, update, handleDeleteProduct}){
    const [name,setName] = useState(row.name)
    const [image,setImage] = useState(`${process.env.REACT_APP_API_HOST}/read_image/${row.image}`)
    const [des,setDes] = useState(row.des)
    const [des_en,setDesEN] = useState(row.des_en)
    const [brochure,setBrochure] = useState(row.brochure)
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file))
      
    };
    const handleUpdateProduct = async (id,name, des, des_en, id_group,brochure) =>{
      if(name?.length > 0){
        let image = document.getElementById("file-upload-product"+id).files[0]
        const response = await updateProduct(id,name, des, des_en, image || '', id_group, brochure)
        Swal.fire(
          response.results.status,
          response.results.msg,
          response.results.status
        )
        if(response.result.status == 'success'){
          setOpen(false)
          setUpdate(!update)
          handleCancel()
        }
      }
    }
    
    const handleCancel = () =>{
      setName(row.name)
      setImage(`${process.env.REACT_APP_API_HOST}/read_image/${row.image}`)
      setDes(row.des)
      setDesEN(row.des_en)
      setOpen(false)
      setBrochure(row.brochure)
    }
    return (
            <Box sx={{ margin: 3}}>
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
                      '& > :not(style)': { m: 2},
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <h3 style={{textAlign:"left"}}>Product name</h3>
                    <FormControl required={true} fullWidth={true}>
                        <TextField
                            required
                            name={"product_name"+row.id_product}
                            onChange={(e)=>{setName(e.target.value)}}
                            error={name?.length == 0} 
                            value={name}
                            helperText = {name?.length == 0 ? "Name cannot be empty" : ""}
                        />
                    </FormControl>
                    <h3 style={{textAlign:"left"}}>Brochure</h3>
                    <FormControl required={true} fullWidth={true}>
                        <TextField
                            name={"brochure"+row.id_product}
                            onChange={(e)=>{setBrochure(e.target.value)}}
                            value={brochure}
                        />
                    </FormControl>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                        spacing={2}
                        sx={{width:'100%'}}
                    >
                        <h3>Product Cover</h3>
                        <div>
                            <input
                                accept="image/*"
                                id={"file-upload-product"+row.id_product}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e)=>{handleImageUpload(e)}}
                            />
  
                            <label htmlFor={"file-upload-product"+row.id_product}>
                                <Button variant="text" color="primary" component="span">
                                    Replace image
                                </Button>
                            </label>
                        </div>
                    </Stack>
                    <Stack  mb={5} sx={{alignItems:"center"}}>
                        <Box
                            sx={{display: 'flex', alignItems:'center', flexDirection:'column'}}
                        >
                            
                            <CardMedia
                                component="img"
                                sx={{ width: 200, height: 200, textAlign: "center" }}
                                image={`${image}`}
                                alt="about 1"
                            />
                        </Box>
                    </Stack>
                    <h3 style={{textAlign:"left"}}>Product description VI</h3>
  
                    <EditorComponent des={des} setDes={setDes}/>
                    <h3 style={{textAlign:"left"}}>Product description EN</h3>
  
                    <EditorComponent des={des_en} setDes={setDesEN}/>
  
                  </Box>
                </Grid>
              </Grid>
              <Divider/>
              <Stack sx={{ m: 2 }} spacing={2} direction="row" justifyContent="space-between">
                <Stack spacing={2} direction="row">
                  <Button variant="contained" onClick={()=>{handleUpdateProduct(row.id_product,name,des,des_en,row.id_group,brochure)}}>Update</Button>
                  <Button variant="text" style={{color:"gray"}} onClick={handleCancel}>Cancel</Button>
                </Stack>
                {
                  !(subList?.length >0) &&
                  <Button variant="text" color="error" onClick={()=>{handleDeleteProduct(row, setUpdate, update)}}>Delete product</Button>
                }
              </Stack>
            </Box>
    )
  }