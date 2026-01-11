import { Autocomplete, Card, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { getProductGroups } from 'src/api';

export function slugify(str) {
  var map = {
    'a': 'á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ|À|Á|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
    'e': 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
    'i': 'í|ì|ỉ|ĩ|ị|î|Í|Ì|Ỉ|Ĩ|Ị',
    'o': 'ó|ò|ỏ|õ|ọ|ơ|ớ|ờ|ở|ỡ|ợ|ô|ố|ồ|ổ|ỗ|ộ|Ó|Ò|Ỏ|Õ|Ọ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ',
    'u': 'ú|ù|ủ|ũ|ụ|ư|ừ|ứ|ử|ữ|ự|û|ü|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Û|Ü',
    'c': 'ç|Ç',
    'n': 'ñ|Ñ',
    'd': 'đ|Đ',
    'y': 'ý|ỳ|ỷ|ỹ|ỵ|Ý|Ỳ|Ỷ|Ỹ|Ỵ'
  };
  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  };
  return str;
};
export default function ShopFilterSidebar({ products, setProductListTemp }) {
  const [productSearch, setProductSearch] = useState(products)
  const [productGroups, setProductGroups] = useState([])

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
        }
      } catch (error) {
        console.error('Error fetching product groups:', error);
      }
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    setProductSearch(products)
  }, [products])
  const handleFilter = (value) => {
    if (value?.length > 0) {
      const productFilter = products.filter((product) => {
        return value.indexOf(product.id_group) > -1
      })
      setProductListTemp(productFilter)
      setProductSearch(productFilter)
    } else {
      setProductListTemp(products)
      setProductSearch(products)
    }
  }
  const handlleSearch = (value, productSearch) => {
    if (value?.length > 0) {
      const productFilter = productSearch.filter(product => {
        if (product.name) {
          return slugify(product.name.toLowerCase()).indexOf(slugify(value.toLowerCase())) >= 0
        }
      });
      setProductListTemp(productFilter)
    } else {
      setProductListTemp(productSearch)
    }
  }
  return (
    <Card sx={{ p: 2, display: 'flex' }}>
      <Autocomplete
        multiple
        id="tags-standard"
        options={productGroups}
        getOptionLabel={(option) => option.label || ""}
        onChange={(e, value) => {
          value = value.map((option) => option.value)
          handleFilter(value)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Category"
          // placeholder="Filter by category"
          />
        )}
        sx={{ width: '30%', px: 2 }}
      />
      <TextField
        variant="outlined"
        label="Search product"
        fullWidth
        placeholder="Search product by name"
        onChange={(e) => { handlleSearch(e.target.value, productSearch) }}
        sx={{ width: '70%' }}
      />
    </Card>
  );
}
