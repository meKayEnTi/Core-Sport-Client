import type{ Product } from "../../src/types/Product";
import { useState, useEffect } from "react";
import ProductList from "../components/Product/ProductList";
import agent from "../services/agent";
import Spinner from "../components/layouts/Spinner";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import type { Brand } from "../../src/types/Brand";
import type { Type } from "../../src/types/Type";

const sortOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("asc"); // Default selected sort
  const [selectedBrand, setSelectedBrand] = useState("All"); // Default selected brand
  const [selectedType, setSelectedType] = useState("All"); // Default selected type
  const [selectedBrandId, setSelectedBrandId] = useState(0); // Default selected brand ID
  const [selectedTypeId, setSelectedTypeId] = useState(0); // Default selected type ID

  const [totalItems, setTotalItems] = useState(0); // Total number of items
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10; // Number of items per page

  useEffect(() => {
    const page = currentPage - 1; // ✅ tính đúng index cho backend
    const size = pageSize;
    Promise.all([
      agent.Product.list(page, size),
      agent.Brand.list(),
      agent.Type.list()
    ])
      .then(([productsRes, brandsRes, typesRes]) => {
        setProducts(productsRes.content);
        setTotalItems(productsRes.totalElements);
        setBrands(brandsRes);
        setTypes(typesRes);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadProducts(selectedSort);
  }, [selectedSort, selectedBrandId, selectedTypeId, currentPage]);
  

  const loadProducts = (selectedSort: string, searchKeyword = '') => {
    setLoading(true);

    const page = currentPage - 1;
    const size = pageSize;
    const brandId = selectedBrandId !== 0 ? selectedBrandId : undefined;
    const typeId = selectedTypeId !== 0 ? selectedTypeId : undefined;
    const sort = 'name';
    const order = selectedSort === 'desc' ? 'desc' : 'asc';

    if (searchKeyword) {
      // Tìm kiếm theo từ khóa
      agent.Product.search(searchKeyword)
        .then((productsRes) => {
          setProducts(productsRes.content);
          setTotalItems(productsRes.length ?? productsRes.content.length);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      // Gọi API bình thường
      agent.Product.list(page, size, brandId, typeId, sort, order)
        .then((productsRes) => {
          setProducts(productsRes.content);
          setTotalItems(productsRes.totalElements);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  };

  const handleSortChange = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setSelectedSort(value); // Update selectedSort state with the new sorting option
    setCurrentPage(1);
  };


  const handleBrandChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const brand = brands.find((b) => b.name === value);

    setSelectedBrand(value);
    setSelectedBrandId(brand?.id ?? 0);
    setCurrentPage(1);
  };
  

  const handleTypeChange = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setSelectedType(value);
    const type = types.find((t) => t.name === value);
    setSelectedTypeId(type ? type.id : 0);
    setCurrentPage(1);
  };
  
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  

  if (loading) return <Spinner message="Loading Products..." />;

  return (
    <Grid container spacing={4}>
      <Grid size ={12}>
        <Box mb={2} textAlign="center">
          <Typography variant="subtitle1">
            Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
          </Typography>
        </Box>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={Math.ceil(totalItems / pageSize)} color="primary" onChange={handlePageChange} page={currentPage} />
        </Box>
      </Grid>
      <Grid size ={3}>
        <Paper sx={{ mb: 2 }}>
          <TextField
            label="Search products"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Trigger search action
                loadProducts(selectedSort, searchTerm); // Pass the search term to loadProducts
              }
            }}
          />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="sort-by-name-label">Sort by Name</FormLabel>
            <RadioGroup
              aria-label="sort-by-name"
              name="sort-by-name"
              value={selectedSort}
              onChange={handleSortChange}
            >
              {sortOptions.map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="brands-label">Brands</FormLabel>
            <RadioGroup
              aria-label="brands"
              name="brands"
              value={selectedBrand}
              onChange={handleBrandChange}
            >
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand.id}
                  value={brand.name}
                  control={<Radio />}
                  label={brand.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="types-label">Types</FormLabel>
            <RadioGroup
              aria-label="types"
              name="types"
              value={selectedType}
              onChange={handleTypeChange}
            >
              {types.map((type) => (
                <FormControlLabel
                  key={type.id}
                  value={type.name}
                  control={<Radio />}
                  label={type.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>
      <Grid size={9}>
        <ProductList products={products} />
      </Grid>
      <Grid size ={12}>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={Math.ceil(totalItems / pageSize)} color="primary" onChange={handlePageChange} page={currentPage} />
        </Box>
      </Grid>
    </Grid>
  );
}