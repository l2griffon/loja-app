import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function XmlUploader() {
  const [xmlText, setXmlText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const parseXmlToProducts = (xmlString) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "text/xml");
    const productElements = xml.getElementsByTagName("product");
    const products = [];

    for (let i = 0; i < productElements.length; i++) {
      const product = productElements[i];
      const name = product.getElementsByTagName("name")[0]?.textContent || "";
      const price = product.getElementsByTagName("price")[0]?.textContent || "";
      const category = product.getElementsByTagName("category")[0]?.textContent || "";
      const image = product.getElementsByTagName("image")[0]?.textContent || "";

      products.push({ name, price: parseFloat(price), category, image });
    }

    return products;
  };

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");

    try {
      const products = parseXmlToProducts(xmlText);

      for (const product of products) {
        await addDoc(collection(db, "products"), product);
      }

      setMessage("Produtos adicionados com sucesso!");
      setXmlText("");
    } catch (error) {
      console.error("Erro ao adicionar produtos:", error);
      setMessage("Erro ao adicionar produtos. Verifique o XML.");
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto p-4 mt-8 shadow-lg">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Adicionar produtos via XML</h2>
        <Textarea
          placeholder="Cole aqui o XML"
          rows={10}
          value={xmlText}
          onChange={(e) => setXmlText(e.target.value)}
        />
        <Button onClick={handleUpload} disabled={loading} className="mt-4">
          {loading ? "Adicionando..." : "Adicionar Produtos"}
        </Button>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </CardContent>
    </Card>
  );
}
