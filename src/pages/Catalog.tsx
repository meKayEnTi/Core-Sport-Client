import type { Product } from '../types/Product';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import ProductList from '../components/Product/ProductList';
import ProductService from '../services/ProductService';
import Spinner from '../components/layouts/Spinner';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.Product.list();
        setProducts(
          response.content.map((product: any) => ({
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
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  if (loading) return <Spinner message="Loading products..." />;
  if (!products || products.length === 0) return <h3>Unable to load products</h3>;
  return (
    <Fragment>
      <ProductList products={products} />
    </Fragment>
  );
}