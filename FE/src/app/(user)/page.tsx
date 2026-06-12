"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "antd";

import Cards from "@/components/cards/cards";
import MainCarousel from "@/components/carousel/carousel";
import ExclusiveBanner1 from "@/components/exclusive1/exclusive1.banner";
import HightLight from "@/components/hightLight/hightLight";
import ProductsGrid from "@/components/productGrid/products.Grid";

export default function UserPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      style={{
        backgroundColor: "#1E2021",
        minHeight: "100vh",
      }}
    >
      <Skeleton active loading={loading} paragraph={false}>
        <MainCarousel />
      </Skeleton>
  
      <Skeleton active loading={loading}>
        <Cards />
      </Skeleton>
  
      <Skeleton active loading={loading}>
        <HightLight />
      </Skeleton>
  
      <Skeleton active loading={loading} paragraph={false}>
        <ExclusiveBanner1 />
      </Skeleton>
  
      <Skeleton active loading={loading}>
        <ProductsGrid />
      </Skeleton>
    </main>
  );
}