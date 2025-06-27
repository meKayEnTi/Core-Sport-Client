import type { Product } from '../types/Product';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import ProductList from '../components/Product/ProductList';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/products?page=0&size=10&sort=name&order=desc');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(
          data.content.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            pictureUrl: product.pictureUrl,
            productType: product.productType,
            productBrand: product.productBrand
          }))
        );
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <Fragment>
      <ProductList products={products} />
    </Fragment>
  );
}