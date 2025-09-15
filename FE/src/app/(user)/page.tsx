"use client";

import Cards from "@/components/cards/cards";
import MainCarousel from "@/components/carousel/carousel";
import HightLight from "@/components/hightLight/hightLight";

export default function UserPage() {
  return (
    <>
      <div>
        <MainCarousel />
        <Cards />
        <HightLight />
      </div>
    </>
  );
}
