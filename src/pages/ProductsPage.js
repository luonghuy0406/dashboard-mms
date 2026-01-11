import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

import Iconify from '../components/iconify';
import { ProductsTable, ProductFilterSidebar } from '../sections/@dashboard/products';

import { getListProducts, getProductGroups } from 'src/api';
import { Link } from 'react-router-dom';


export default function ProductsPage() {
  const [productList, setProductList] = useState([])
  const [productListTemp, setProductListTemp] = useState([])
  const [productGroupMapping, setProductGroupMapping] = useState({})
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const [productLists, groupsResponse] = await Promise.all([
        getListProducts(),
        getProductGroups()
      ]);

      if (productLists.results) {
        setProductList(productLists.results)
        setProductListTemp(productLists.results)
      }

      if (groupsResponse.results) {
        const mapping = {};
        groupsResponse.results.forEach(g => {
          mapping[g.id_group.toString()] = g.name;
        });
        setProductGroupMapping(mapping);
      }
    }
    fetchData();

  }, [update])

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | MEKONG MARINE SUPPLY CO., LTD </title>
      </Helmet>

      <Container maxWidth={'xl'}>
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Products
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link to="/dashboard/products/add" style={{ textDecoration: 'none' }}>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                  New product
                </Button>
              </Link>
            </Stack>
          </Stack>
          <Stack spacing={3} mb={5}>
            <ProductFilterSidebar products={productList} setProductListTemp={setProductListTemp} />
          </Stack>
        </Box>
        <ProductsTable
          items={productListTemp}
          productGroup={productGroupMapping}
          setUpdate={setUpdate}
          update={update}
        />
      </Container>
    </>
  );
}



