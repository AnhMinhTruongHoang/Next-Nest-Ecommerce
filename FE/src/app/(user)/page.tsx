"use client";

import Cards from "@/components/cards/cards";
import MainCarousel from "@/components/carousel/carousel";
import ExclusiveBanner1 from "@/components/exclusive1/exclusive1.banner";
import HightLight from "@/components/hightLight/hightLight";
import ProductsGrid from "@/components/productGrid/products.Grid";

export default function UserPage() {
  return (
    <>
      <div>
        <MainCarousel />
        <Cards />
        <HightLight />
        <ExclusiveBanner1 />
        <ProductsGrid />
      </div>
    </>
  );
}
