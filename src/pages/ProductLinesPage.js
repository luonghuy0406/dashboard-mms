import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

import Iconify from '../components/iconify';
import { ProductLineTable } from '../sections/@dashboard/products';
import { getProductGroups, addProductGroup } from 'src/api';
import Swal from 'sweetalert2';

export default function ProductLinesPage() {
    const [productGroups, setProductGroups] = useState([])
    const [update, setUpdate] = useState(false)

    const handleAddProductLine = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add new product line',
            width: '800px',
            html:
                '<div style="text-align: left;">' +
                '<label>Name</label>' +
                '<input id="swal-input-name" class="swal2-input" placeholder="Name" style="width: 100%; margin: 0; margin-top: 10px;">' +
                '<label style="display: block; margin-top: 10px;">Detail (VI - For SEO)</label>' +
                '<textarea id="swal-input-detail" class="swal2-textarea" placeholder="Detail VI" style="width: 100%; height: 100px; margin: 0; margin-top: 10px;"></textarea>' +
                '<label style="display: block; margin-top: 10px;">Detail (EN - For SEO)</label>' +
                '<textarea id="swal-input-detail-en" class="swal2-textarea" placeholder="Detail EN" style="width: 100%; height: 100px; margin: 0; margin-top: 10px;"></textarea>' +
                '</div>',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const name = document.getElementById('swal-input-name').value;
                const detail = document.getElementById('swal-input-detail').value;
                const detail_en = document.getElementById('swal-input-detail-en').value;
                if (!name) {
                    Swal.showValidationMessage('Bạn cần nhập tên!');
                    return false;
                }
                return { name, detail, detail_en };
            }
        })

        if (formValues) {
            const { name, detail, detail_en } = formValues;
            const response = await addProductGroup(name, detail, detail_en);
            if (response.results?.status === 'success') {
                Swal.fire('Success', 'Product line added successfully', 'success');
                setUpdate(!update);
            } else {
                Swal.fire('Error', response.results?.msg || 'Could not add product line', 'error');
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            const groupsResponse = await getProductGroups();

            if (groupsResponse.results) {
                setProductGroups(groupsResponse.results);
            }
        }
        fetchData();

    }, [update])

    return (
        <>
            <Helmet>
                <title> Dashboard: Product Lines | MEKONG MARINE SUPPLY CO., LTD </title>
            </Helmet>

            <Container maxWidth={'xl'}>
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Product Lines
                        </Typography>
                        <Button variant="contained" onClick={handleAddProductLine} startIcon={<Iconify icon="eva:plus-fill" />}>
                            Add product line
                        </Button>
                    </Stack>
                    <ProductLineTable groups={productGroups} setUpdate={setUpdate} update={update} />
                </Box>
            </Container>
        </>
    );
}
