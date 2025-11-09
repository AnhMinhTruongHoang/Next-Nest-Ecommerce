"use client";

import Image from "next/image";

export default function Page() {
  return (
    <main className="w-screen h-screen overflow-y-auto bg-black text-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center">
        <Image
          src="/images/hero-bg.jpg"
          alt="Infographic Background"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            ĐÃ RẤT LÂU RỒI MỚI THẤY <br />
            <span className="text-yellow-400">
              MỘT SỰ KIỆN TTĐT TRONG NHÀ ĐÃ ĐẾN THẾ!
            </span>
          </h1>
        </div>
      </section>

      {/* Content sections (ảnh + đoạn text) */}
      <section className="relative w-full bg-[#1c1c1c] flex flex-col items-center py-24">
        <div className="max-w-3xl text-justify leading-relaxed px-4 text-lg">
          <p className="mb-6">
            Ở Sài Gòn, đã có nhiều giải đấu nhỏ theo phong trào diễn ra trong
            một năm, với đủ loại game khác nhau về nội dung, nhưng chung một mục
            đích: liên kết người chơi thành một cộng đồng, ở ngoài đời thực.
          </p>
          <p>
            Với tên gọi đầy ngạo nghễ <em>“One True King”</em>, đã phần nào nâng
            cấp sức đối kháng và tăng mức kịch tính trước thềm trận chung kết...
          </p>
        </div>

        {/* Hình minh họa lớn */}
        <div className="relative w-full max-w-5xl mt-12">
          <Image
            src="/images/event-photo.jpg"
            alt="Event"
            width={1200}
            height={700}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>
    </main>
  );
}
