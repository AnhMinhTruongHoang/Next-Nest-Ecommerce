import { Card, Button } from "antd";
import Image from "next/image";

const HightLight = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: 25,
        justifyContent: "center",
        marginTop: 16,
        marginBottom: 50,
        flexWrap: "wrap", // responsive
      }}
    >
      {/* Card 1 */}
      <Card
        hoverable
        style={{
          width: 882,
          height: 600,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
        cover={
          <div style={{ position: "relative", width: "100%", height: "600px" }}>
            <Image
              alt="Men Wear"
              src="/images/cards/gitwar2.png"
              fill
              style={{
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              className="highlight-img"
            />
            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: "30px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                color: "#fff",
              }}
            >
              <h2
                style={{ fontSize: 36, fontWeight: "bold", marginBottom: 10 }}
              >
                MEN WEAR
              </h2>
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                KHÁM PHÁ
              </Button>
            </div>
          </div>
        }
      />

      {/* Card 2 */}
      <Card
        hoverable
        style={{
          width: 882,
          height: 600,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
        cover={
          <div style={{ position: "relative", width: "100%", height: "600px" }}>
            <Image
              alt="Women Active"
              src="/images/cards/gitwar2.png"
              fill
              style={{
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              className="highlight-img"
            />
            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: "30px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                color: "#fff",
              }}
            >
              <h2
                style={{ fontSize: 36, fontWeight: "bold", marginBottom: 10 }}
              >
                WOMEN ACTIVE
              </h2>
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                KHÁM PHÁ
              </Button>
            </div>
          </div>
        }
      />

      {/* CSS hover zoom */}
      <style jsx>{`
        .highlight-img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default HightLight;
