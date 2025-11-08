import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import SPlusLogo from "../../assets/S+Logo.png";

const navLinks = [
  { path: "/", label: "Trang chủ" },
  { path: "/studio", label: "Studio" },
  { path: "/equipment", label: "Thiết bị" },
  { path: "/about", label: "Về chúng tôi" },
  { path: "/contact", label: "Liên hệ" },
];

const NavbarMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-red-500 shadow-sm sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-4 py-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={SPlusLogo}
            alt="S+ Studio Logo"
            className="h-6 w-auto object-contain"
          />
        </Link>
        <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuOutlined />
        </Button>
      </div>
      {isMenuOpen && (
        <nav className="bg-white border-t">
          <ul className="flex flex-col p-4 space-y-2">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
             <li className="border-t pt-4">
                <Button type="primary" href="/register" block>
                    Đăng ký
                </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default NavbarMobile;
