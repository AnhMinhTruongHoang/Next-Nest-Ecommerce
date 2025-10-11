// import { useState } from "react";
// import { FaReact } from "react-icons/fa";
// import { FiShoppingCart } from "react-icons/fi";
// import { VscSearchFuzzy } from "react-icons/vsc";
// import { Divider, Badge, Drawer, Avatar, Popover, Empty } from "antd";
// import { Dropdown, Space } from "antd";
// import { useNavigate } from "react-router";
// import "./app.header.scss";
// import { Link } from "react-router-dom";
// import { useCurrentApp } from "components/context/app.context"; // Lấy dữ liệu từ global context (user, carts...)
// import { logoutAPI } from "@/services/api";
// import ManageAccount from "../client/account";
// import { isMobile } from "react-device-detect";

// // Props từ component cha để truyền searchTerm
// interface IProps {
//   searchTerm: string;
//   setSearchTerm: (v: string) => void;
// }

// const AppHeader = (props: IProps) => {
//   // State để mở/đóng Drawer (menu bên trái khi mobile)
//   const [openDrawer, setOpenDrawer] = useState(false);
//   // State mở modal quản lý tài khoản
//   const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

//   // Lấy dữ liệu từ Context App
//   const {
//     isAuthenticated, // boolean: user đã login chưa
//     user, // thông tin user
//     setUser, // set lại user sau logout
//     setIsAuthenticated, // set lại trạng thái đăng nhập
//     carts, // danh sách sản phẩm trong giỏ hàng
//     setCarts,
//   } = useCurrentApp();

//   const navigate = useNavigate();

//   // 🚪 Xử lý logout
//   const handleLogout = async () => {
//     const res = await logoutAPI();
//     if (res.data) {
//       setUser(null); // Clear user
//       setCarts([]); // Clear giỏ hàng
//       setIsAuthenticated(false); // Reset trạng thái login
//       localStorage.removeItem("access_token"); // Xóa token
//       localStorage.removeItem("carts"); // Xóa giỏ local
//     }
//   };

//   // 🧾 Menu Dropdown khi click vào Avatar user
//   let items = [
//     {
//       label: (
//         <label
//           style={{ cursor: "pointer" }}
//           onClick={() => setOpenManageAccount(true)}
//         >
//           Quản lý tài khoản
//         </label>
//       ),
//       key: "account",
//     },
//     {
//       label: <Link to="/history">Lịch sử mua hàng</Link>,
//       key: "history",
//     },
//     {
//       label: (
//         <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
//           Đăng xuất
//         </label>
//       ),
//       key: "logout",
//     },
//   ];

//   // Nếu user là ADMIN, thêm link vào admin dashboard
//   if (user?.role === "ADMIN") {
//     items.unshift({
//       label: <Link to="/admin">Trang quản trị</Link>,
//       key: "admin",
//     });
//   }

//   // Ảnh avatar user
//   const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
//     user?.avatar
//   }`;

//   // 🎯 Nội dung popover hiển thị sản phẩm mới thêm vào giỏ hàng
//   const contentPopover = () => {
//     return (
//       <div className="pop-cart-body">
//         <div className="pop-cart-content">
//           {carts?.map((book, index) => {
//             return (
//               <div className="book" key={`book-${index}`}>
//                 <img
//                   src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
//                     book?.detail?.thumbnail
//                   }`}
//                 />
//                 <div>{book?.detail?.mainText}</div>
//                 <div className="price">
//                   {new Intl.NumberFormat("vi-VN", {
//                     style: "currency",
//                     currency: "VND",
//                   }).format(book?.detail?.price ?? 0)}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         {carts.length > 0 ? (
//           <div className="pop-cart-footer">
//             <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
//           </div>
//         ) : (
//           <Empty description="Không có sản phẩm trong giỏ hàng" />
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="header-container">
//         <header className="page-header">
//           {/* ─────────── TOP HEADER ─────────── */}
//           <div className="page-header__top">
//             {/* Icon mở Drawer (mobile menu) */}
//             <div
//               className="page-header__toggle"
//               onClick={() => setOpenDrawer(true)}
//             >
//               ☰
//             </div>

//             {/* Logo & Search */}
//             <div className="page-header__logo">
//               <span className="logo">
//                 <span onClick={() => navigate("/")}>
//                   <FaReact className="rotate icon-react" /> Hỏi Dân !T
//                 </span>
//                 <VscSearchFuzzy className="icon-search" />
//               </span>

//               <input
//                 className="input-search"
//                 type={"text"}
//                 placeholder="Bạn tìm gì hôm nay"
//                 value={props.searchTerm}
//                 onChange={(e) => props.setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* ─────────── BOTTOM NAVIGATION ─────────── */}
//           <nav className="page-header__bottom">
//             <ul id="navigation" className="navigation">
//               {/* 🛒 Giỏ hàng */}
//               <li className="navigation__item">
//                 {!isMobile ? (
//                   <Popover
//                     className="popover-carts"
//                     placement="topRight"
//                     rootClassName="popover-carts"
//                     title={"Sản phẩm mới thêm"}
//                     content={contentPopover}
//                     arrow={true}
//                   >
//                     <Badge count={carts?.length ?? 0} size={"small"} showZero>
//                       <FiShoppingCart className="icon-cart" />
//                     </Badge>
//                   </Popover>
//                 ) : (
//                   <Badge
//                     count={carts?.length ?? 0}
//                     size={"small"}
//                     showZero
//                     onClick={() => navigate("/order")}
//                   >
//                     <FiShoppingCart className="icon-cart" />
//                   </Badge>
//                 )}
//               </li>

//               <li className="navigation__item mobile">
//                 <Divider type="vertical" />
//               </li>

//               {/* 👤 Tài khoản user */}
//               <li className="navigation__item mobile">
//                 {!isAuthenticated ? (
//                   <span onClick={() => navigate("/login")}> Tài Khoản</span>
//                 ) : (
//                   <Dropdown menu={{ items }} trigger={["click"]}>
//                     <Space>
//                       <Avatar src={urlAvatar} />
//                       {user?.fullName}
//                     </Space>
//                   </Dropdown>
//                 )}
//               </li>
//             </ul>
//           </nav>
//         </header>
//       </div>

//       {/* Drawer: hiển thị menu trên mobile */}
//       <Drawer
//         title="Menu chức năng"
//         placement="left"
//         onClose={() => setOpenDrawer(false)}
//         open={openDrawer}
//       >
//         <p>Quản lý tài khoản</p>
//         <Divider />
//         <p onClick={() => handleLogout()}>Đăng xuất</p>
//         <Divider />
//       </Drawer>

//       {/* Modal quản lý tài khoản */}
//       <ManageAccount
//         isModalOpen={openManageAccount}
//         setIsModalOpen={setOpenManageAccount}
//       />
//     </>
//   );
// };

// export default AppHeader;
