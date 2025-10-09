// import React from "react";
// import Image from "next/image";

// const ProductCard = ({ product }) => {
//   return (
//     <div
//       onClick={() => {
//         router.push("/product/" + product._id);
//         scrollTo(0, 0);
//       }}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         gap: "0.125rem", // gap-0.5
//         maxWidth: "200px",
//         width: "100%",
//         cursor: "pointer",
//       }}
//     >
//       {/* Hình ảnh */}
//       <div
//         style={{
//           position: "relative",
//           backgroundColor: "rgba(107, 114, 128, 0.1)", // bg-gray-500/10
//           borderRadius: "0.5rem",
//           width: "100%",
//           height: "13rem", // h-52
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           overflow: "hidden",
//         }}
//       >
//         <Image
//           src={product.image[0]}
//           alt={product.name}
//           width={800}
//           height={800}
//           style={{
//             transition: "transform 0.3s ease",
//             objectFit: "cover",
//             width: "80%",
//             height: "80%",
//           }}
//           onMouseEnter={(e) => {
//             (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLElement).style.transform = "scale(1)";
//           }}
//         />
//         <button
//           title="navigate"
//           style={{
//             position: "absolute",
//             top: "0.5rem",
//             right: "0.5rem",
//             backgroundColor: "#fff",
//             padding: "0.5rem",
//             borderRadius: "9999px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             cursor: "pointer",
//           }}
//         >
//           <Image
//             src={assets.heart_icon}
//             alt="heart_icon"
//             style={{ width: "0.75rem", height: "0.75rem" }}
//           />
//         </button>
//       </div>

//       {/* Tên sản phẩm */}
//       <p
//         style={{
//           fontWeight: 500,
//           paddingTop: "0.5rem",
//           width: "100%",
//           fontSize: "1rem",
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//         }}
//       >
//         {product.name}
//       </p>

//       {/* Mô tả */}
//       <p
//         style={{
//           width: "100%",
//           fontSize: "0.75rem",
//           color: "rgba(107, 114, 128, 0.7)",
//           whiteSpace: "nowrap",
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//         }}
//       >
//         {product.description}
//       </p>

//       {/* Rating */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "0.5rem",
//         }}
//       >
//         <p style={{ fontSize: "0.75rem" }}>{4.5}</p>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "0.125rem",
//           }}
//         >
//           {Array.from({ length: 5 }).map((_, index) => (
//             <Image
//               key={index}
//               src={
//                 index < Math.floor(4) ? assets.star_icon : assets.star_dull_icon
//               }
//               alt="star_icon"
//               style={{ width: "0.75rem", height: "0.75rem" }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Giá + nút Buy */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-end",
//           justifyContent: "space-between",
//           width: "100%",
//           marginTop: "0.25rem",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "1rem",
//             fontWeight: 500,
//           }}
//         >
//           {currency}
//           {product.offerPrice}
//         </p>
//         <button
//           style={{
//             padding: "0.375rem 1rem",
//             border: "1px solid rgba(107, 114, 128, 0.2)",
//             borderRadius: "9999px",
//             fontSize: "0.75rem",
//             color: "rgb(107 114 128)",
//             backgroundColor: "transparent",
//             transition: "background-color 0.2s ease",
//             cursor: "pointer",
//           }}
//           onMouseEnter={(e) => {
//             (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//               "rgba(248, 250, 252, 0.9)"; // hover:bg-slate-50
//           }}
//           onMouseLeave={(e) => {
//             (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//               "transparent";
//           }}
//         >
//           Buy now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
