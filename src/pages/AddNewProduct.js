import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography, TextField, Card, CardMedia, Box, Autocomplete, FormControl, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorComponent } from 'src/sections/@dashboard/products';
import { addProduct, getProductGroups } from 'src/api';
import Swal from 'sweetalert2';

export default function AddNewProduct() {
    const [name, setName] = useState('')
    const [des, setDes] = useState('')
    const [des_en, setDesEN] = useState('')
    const [image, setImage] = useState('')
    const [group, setGroup] = useState('')
    const [productGroups, setProductGroups] = useState([])
    const [brochure, setBrochure] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await getProductGroups();
                if (response.results) {
                    const mappedGroups = response.results.map(g => ({
                        value: g.id_group,
                        label: g.name
                    }));
                    setProductGroups(mappedGroups);
                    if (mappedGroups.length > 0) {
                        setGroup(mappedGroups[0].value);
                    }
                }
            } catch (error) {
                console.error('Error fetching product groups:', error);
            }
        }
        fetchGroups();
    }, []);
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file))

    };
    const handleAddProduct = async (name, des, des_en, image, id_group, brochure) => {
        if (name && image) {
            let imageUpload = document.getElementById("file-upload-new-product").files[0]
            const response = await addProduct(name, des, des_en, imageUpload, id_group, brochure)
            if (response.results.status == 'success') {
                handleCancel()
                navigate('/dashboard/products', { replace: true });
            }
            Swal.fire(
                response.results.status,
                `Add product ${name} success!`,
                response.results.status
            )
        }
    }
    const handleCancel = () => {
        setName('')
        setDes('')
        setDesEN('')
        setImage('')
        setGroup('')
        setBrochure('')
        document.getElementById("file-upload-new-product").value = null
    }
    return (
        <>
            <Helmet>
                <title> Dashboard: Add new product | MEKONG MARINE SUPPLY CO., LTD </title>
            </Helmet>


            <Container maxWidth={'xl'}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Add new product
                    </Typography>
                </Stack>
                <Stack mb={5}>
                    <Card sx={{ p: 2 }}>
                        <Grid container>
                            <Grid item xs={6} md={6} lg={6}>
                                <Typography variant="h6" gutterBottom>
                                    Product name
                                </Typography>
                                <FormControl required={true} fullWidth={true}>
                                    <TextField
                                        required
                                        variant='standard'
                                        name={"product_name"}
                                        onChange={(e) => { setName(e.target.value) }}
                                        error={name?.length == 0}
                                        helperText={name?.length == 0 ? "Name cannot be empty" : ""}
                                        value={name}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6}>
                                <Typography variant="h6" gutterBottom>
                                    Product group
                                </Typography>
                                <Autocomplete
                                    fullWidth
                                    options={productGroups}
                                    getOptionLabel={(option) => option.label || ""}
                                    value={productGroups.find(g => g.value === group) || null}
                                    onChange={(e, value) => {
                                        if (value) setGroup(value.value)
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                        />
                                    )}
                                    sx={{ width: '100%', px: 2 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" gutterBottom>
                                Brochure
                            </Typography>
                            <FormControl required={true} fullWidth={true}>
                                <TextField
                                    required
                                    variant='standard'
                                    name={"brochure"}
                                    onChange={(e) => { setBrochure(e.target.value) }}
                                    value={brochure}
                                />
                            </FormControl>
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
                                <h3>Product Cover</h3>
                                <div>
                                    <input
                                        accept="image/*"
                                        id={"file-upload-new-product"}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleImageUpload(e) }}
                                    />

                                    <label htmlFor={"file-upload-new-product"}>
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
                                    // alt="about 1"
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
                <Stack mb={5} >
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Product Description EN
                        </Typography>
                        <EditorComponent des={des_en} setDes={setDesEN} />
                    </Card>
                </Stack>
                <Stack mb={5} >
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Product Description VI
                        </Typography>
                        <EditorComponent des={des} setDes={setDes} />
                    </Card>
                </Stack>

                <Stack sx={{ m: 2 }} spacing={2} direction="row" justifyContent="end">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={() => { handleAddProduct(name, des, des_en, image, group, brochure) }}>Save post</Button>
                        <Button variant="text" style={{ color: "gray" }} onClick={handleCancel}>Cancel</Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}
