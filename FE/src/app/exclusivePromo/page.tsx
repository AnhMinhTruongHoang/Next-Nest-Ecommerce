"use client";

import Image from "next/image";
import styles from "@/styles/postPage.module.scss";
import { Button } from "antd";
import Link from "next/link";

export default function ExclusivePage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.eyebrow}>Razer x Zenless Zone Zero</h1>
          <h2 className={styles.title}>
            Bộ sưu tập Zenless Zone Zero chính thức ra mắt
          </h2>
          <p className={styles.date}>22/10/2025</p>
        </header>

        <figure className={styles.figure}>
          <Image
            src="/images/banners/razerBanner.jpg"
            alt="Razer | Zenless Zone Zero collection"
            fill
            sizes="(max-width: 980px) 100vw, 980px"
            className={styles.img}
            priority
          />
          <figcaption className={styles.caption}>
            Razer’s latest collaboration channels the bold style of Zenless Zone
            Zero into a lineup of battle-ready gaming peripherals.
          </figcaption>
        </figure>

        <section className={styles.section}>
          <p>
            Razer™, thương hiệu phong cách sống hàng đầu dành cho game thủ, hợp
            tác cùng HoYoverse để ra mắt bộ sưu tập phụ kiện chính thức đầu tiên
            cho <em>Zenless Zone Zero</em>. Bộ sưu tập{" "}
            <strong style={{ color: "#44d62c" }}>
              Razer | Zenless Zone Zero
            </strong>{" "}
            mang phong cách thời thượng, sưu tầm được, đồng thời vẫn sẵn sàng
            cho mọi trận chiến.
          </p>
          <p>
            Đưa nhịp đập của <em>New Eridu</em> vào chiến trường, phiên bản độc
            quyền này lấy cảm hứng từ nhân vật Miyabi — tái hiện biểu tượng rắn
            của Razer với hoạ tiết đặc trưng. Kết quả là những thiết bị vừa có
            chất nghệ, vừa tối ưu hiệu năng — hoàn hảo cho fan, game thủ casual,
            và người sưu tầm.
          </p>
          <blockquote className={styles.quote}>
            “Sự hợp tác này là lời tri ân tới cộng đồng Zenless Zone Zero.” —
            Addie Tan, Global Head of Lifestyle Division tại Razer. “Phong thái
            sắc sảo của Miyabi phản chiếu tinh thần hiệu năng và thiết kế tiên
            phong của Razer. Chúng tôi rất vinh dự đưa sự hiện diện của cô vào
            đời thực, cho game thủ một cách mới để thể hiện fandom của mình cả
            trong và ngoài game.”
          </blockquote>
        </section>

        <section className={styles.section}>
          <h3 className={styles.h3}>
            <span style={{ color: "coral" }}> Zenless Zone Zero </span>X
            <span style={{ color: "#44d62c" }}> Razer</span>
          </h3>
          <p>
            Bộ sưu tập gồm <strong>Razer Iskur V2 X</strong>,{" "}
            <strong>Razer BlackWidow V4 X</strong>, <strong>Razer Cobra</strong>{" "}
            và <strong>Razer Gigantus V2 – Medium</strong>, tất cả đều mang dấu
            ấn Miyabi. Dù bạn lao vào Hollows hay tinh chỉnh góc máy, các thiết
            bị này được chế tác để giúp bạn bứt phá giữa hỗn mang.
          </p>
          <p>
            Mỗi đơn hàng còn mở khóa phần thưởng trong game độc quyền, giúp
            người chơi nâng tầm trải nghiệm <em>Zenless Zone Zero</em> cả trong
            game lẫn đời thực.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.h3}>
            Razer Iskur V2 X — Zenless Zone Zero Edition
          </h3>

          <figure className={styles.figure}>
            <Image
              src="/images/postImages/chair.webp"
              alt="Razer Iskur V2 X – Zenless Zone Zero Edition"
              fill
              sizes="(max-width: 980px) 100vw, 980px"
              className={styles.img}
            />

            <figcaption className={styles.caption}>
              Razer Iskur V2 X — Zenless Zone Zero Edition
            </figcaption>
          </figure>

          <p style={{ textAlign: "center", justifyContent: "center" }}>
            Razer Iskur V2 X – Zenless Zone Zero Edition
          </p>

          <p>
            Sự thoải mái đạt chuẩn chiến trường kết hợp công thái học trong một
            chiếc ghế gaming “giữ vững đường kẻ” — đúng như Miyabi. Tựa lưng,
            đệm ngồi và họa tiết được tối ưu cho các phiên chơi dài, đồng thời
            vẫn phô diễn trọn vẹn thần thái của bộ sưu tập.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.h3}>
            Razer BlackWidow V4 X – Zenless Zone Zero Edition
          </h3>

          <figure className={styles.figure}>
            <Image
              src="/images/postImages/keyboard.webp"
              alt="Razer Iskur V2 X – Zenless Zone Zero Edition"
              fill
              sizes="(max-width: 980px) 100vw, 980px"
              className={styles.img}
            />
            <figcaption className={styles.caption}>
              Razer BlackWidow V4 X – Zenless Zone Zero Edition
            </figcaption>
          </figure>

          <p style={{ textAlign: "center", justifyContent: "center" }}>
            Razer BlackWidow V4 X – Zenless Zone Zero Edition
          </p>

          <p>
            Khai phá kỹ năng chiến đấu của Miyabi với chiếc bàn phím cơ cấp S
            này — sở hữu 6 phím macro chuyên dụng, cảm giác gõ clicky chuẩn xác,
            và hệ thống đèn Razer Chroma RGB toàn phổ rực rỡ như những đòn kết
            liễu của cô ấy.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.h3}>Razer Cobra – Zenless Zone Zero Edition</h3>

          <figure className={styles.figure}>
            <Image
              src="/images/postImages/mo.webp"
              alt="Razer Iskur V2 X – Zenless Zone Zero Edition"
              fill
              sizes="(max-width: 980px) 100vw, 980px"
              className={styles.img}
            />
            <figcaption className={styles.caption}>
              Razer Cobra – Zenless Zone Zero Edition
            </figcaption>
          </figure>

          <p style={{ textAlign: "center", justifyContent: "center" }}>
            Razer Cobra – Zenless Zone Zero Edition
          </p>

          <p>
            Ra đòn nhanh và chuẩn xác với chiếc chuột gaming có dây siêu nhẹ,
            được thiết kế theo phong cách kiếm thuật tinh tế của Miyabi. Trang
            bị switch quang học thế hệ mới, chuột mang lại độ chính xác tuyệt
            đối — không bỏ lỡ bất kỳ cú click nào. Kết hợp với đèn nền Razer
            Chroma RGB toàn phổ, mỗi chuyển động đều rực rỡ như những đòn kết
            liễu của Void Hunter.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.h3}>
            Razer Gigantus V2 – Medium – Zenless Zone Zero Edition
          </h3>

          <figure className={styles.figure}>
            <Image
              src="/images/postImages/Pad.webp"
              alt="Razer Iskur V2 X – Zenless Zone Zero Edition"
              fill
              sizes="(max-width: 980px) 100vw, 980px"
              className={styles.img}
            />
            <figcaption className={styles.caption}>
              Razer Gigantus V2 – Medium – Zenless Zone Zero Edition
            </figcaption>
          </figure>

          <p style={{ textAlign: "center", justifyContent: "center" }}>
            Razer Gigantus V2 – Medium – Zenless Zone Zero Edition
          </p>

          <p>
            Bộ sưu tập Razer | Zenless Zone Zero là sự kết hợp táo bạo giữa
            phong cách nghệ thuật và câu chuyện chiến đấu, mang đến trải nghiệm
            gaming đậm chất anime cho mọi đối tượng: từ Agent, game thủ, đến nhà
            sưu tầm. Bạn có thể xem thêm chi tiết về bộ sưu tập{" "}
            <strong style={{ color: "#44d62c" }}>
              Razer | Zenless Zone Zero
            </strong>{" "}
            tại
            <Link href={"/productsList?brand=Razer/zzz&sort=-sold"}> đây</Link>.
          </p>
        </section>
      </article>
    </main>
  );
}
