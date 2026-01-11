import { useEffect, useState } from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Avatar,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    IconButton,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// api
import { getFeaturedProducts, updateProduct, getListProducts } from 'src/api';
import Swal from 'sweetalert2';
import { Modal, TextField, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';

// ----------------------------------------------------------------------

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '80vh',
    overflow: 'auto',
};

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [localProducts, setLocalProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [update, setUpdate] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getFeaturedProducts();
                if (response.results) {
                    const sorted = [...response.results].sort((a, b) => a.is_featured - b.is_featured);
                    setProducts(sorted);
                    setLocalProducts(sorted);
                    setIsChanged(false);
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }
        }
        fetchData();
    }, [update]);

    useEffect(() => {
        async function fetchAllProducts() {
            try {
                const response = await getListProducts();
                if (response.results) {
                    setAllProducts(response.results);
                }
            } catch (error) {
                console.error('Error fetching all products:', error);
            }
        }
        if (openAddModal) {
            fetchAllProducts();
        }
    }, [openAddModal]);

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newProducts = [...localProducts];
        const temp = newProducts[index];
        newProducts[index] = newProducts[index - 1];
        newProducts[index - 1] = temp;
        setLocalProducts(newProducts);
        setIsChanged(true);
    };

    const handleMoveDown = (index) => {
        if (index === localProducts.length - 1) return;
        const newProducts = [...localProducts];
        const temp = newProducts[index];
        newProducts[index] = newProducts[index + 1];
        newProducts[index + 1] = temp;
        setLocalProducts(newProducts);
        setIsChanged(true);
    };

    const handleSaveOrder = async () => {
        Swal.fire({
            title: 'Saving new order...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            for (let i = 0; i < localProducts.length; i++) {
                const product = localProducts[i];
                const newOrder = i + 1;
                await updateProduct(
                    product.id_product,
                    product.name,
                    product.des,
                    product.des_en,
                    "",
                    product.id_group,
                    product.brochure,
                    product.spec,
                    product.spec_en,
                    newOrder
                );
            }
            Swal.fire('Thành công', 'Đã lưu thứ tự mới.', 'success');
            setUpdate(!update);
            setIsChanged(false);
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể lưu thứ tự.', 'error');
        }
    };

    const handleRemove = async (product) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Remove ${product.name} from featured products?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await updateProduct(
                        product.id_product,
                        product.name,
                        product.des,
                        product.des_en,
                        "",
                        product.id_group,
                        product.brochure,
                        product.spec,
                        product.spec_en,
                        0 // is_featured = 0
                    );
                    if (response.results.status === 'success') {
                        Swal.fire('Removed!', 'Product has been removed from featured.', 'success');
                        setUpdate(!update);
                    } else {
                        Swal.fire('Error', response.results.msg, 'error');
                    }
                } catch (error) {
                    console.error('Error updating product:', error);
                }
            }
        });
    };

    const handleAddFeatured = async (product) => {
        try {
            const nextOrder = products.length + 1;
            const response = await updateProduct(
                product.id_product,
                product.name,
                product.des,
                product.des_en,
                "",
                product.id_group,
                product.brochure,
                product.spec,
                product.spec_en,
                nextOrder
            );
            if (response.results.status === 'success') {
                Swal.fire('Added!', 'Product has been added to featured.', 'success');
                setUpdate(!update);
                setOpenAddModal(false);
            } else {
                Swal.fire('Error', response.results.msg, 'error');
            }
        } catch (error) {
            console.error('Error adding product to featured:', error);
        }
    };

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !products.some(p => p.id_product === product.id_product)
    );

    return (
        <Card>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    Featured Products
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => setOpenAddModal(true)}>
                        Add Featured
                    </Button>
                    {isChanged && (
                        <Button variant="contained" color="warning" onClick={handleSaveOrder}>
                            Save Order
                        </Button>
                    )}
                </Stack>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="featured products table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Sort</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="center">Image</TableCell>
                            {/* <TableCell align="center">Order</TableCell> */}
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {localProducts.map((row, index) => (
                            <TableRow
                                key={row.id_product}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">
                                    <Stack direction="row" justifyContent="center">
                                        <IconButton size="small" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                                            <ArrowUpwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleMoveDown(index)} disabled={index === localProducts.length - 1}>
                                            <ArrowDownwardIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">
                                    <Avatar
                                        alt={row.name}
                                        src={`https://api.mmsvn.com/read_image/${row.image}`}
                                        variant="rounded"
                                        sx={{ width: 64, height: 64, margin: 'auto' }}
                                    />
                                </TableCell>
                                {/* <TableCell align="center">
                                    {row.is_featured}
                                </TableCell> */}
                                <TableCell align="center">
                                    <Button variant="text" color="error" onClick={() => handleRemove(row)}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                aria-labelledby="modal-add-featured"
            >
                <Box sx={styleModal}>
                    <Typography id="modal-add-featured" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Add Product to Featured
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <List>
                        {filteredProducts.map((item) => (
                            <div key={item.id_product}>
                                <ListItem
                                    secondaryAction={
                                        <Button size="small" variant="outlined" onClick={() => handleAddFeatured(item)}>
                                            Add
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={item.name}
                                            src={`https://api.mmsvn.com/read_image/${item.image}`}
                                            variant="rounded"
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </div>
                        ))}
                    </List>
                </Box>
            </Modal>
        </Card>
    );
}
