import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Produtos cadastrados</h2>
      {products.map(product => (
        <Card key={product.id} className="shadow-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Preço: R$ {Number(product.price).toFixed(2)}</p>
            <p className="text-gray-600 mt-1">Categoria: <Badge>{product.category}</Badge></p>
            {product.image && (
              <img src={product.image} alt={product.name} className="mt-2 max-h-48 rounded" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
