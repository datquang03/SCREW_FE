import React, { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../features/auth/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form gửi đi:", form);
    dispatch(register(form));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Ảnh minh họa */}
        <div className="md:w-1/2 bg-gray-50 flex justify-center items-center p-16">
          <img
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/media/7ed7d5bbf2cbbd36b8a88a06c6d9b277.png"
            alt="Minh họa đăng ký"
            className="w-[340px] md:w-[440px] object-contain"
          />
        </div>

        {/* Form đăng ký */}
        <div className="md:w-1/2 p-16 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Đăng ký</h1>
          <p className="text-gray-500 mb-10 text-lg">
            Hãy điền thông tin của bạn để tạo tài khoản cá nhân.
          </p>

          <form className="flex flex-col gap-6 mb-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Tên người dùng (username)"
              value={form.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            {error && (
              <div className="text-red-500 text-base">{error.message || "Đăng ký thất bại"}</div>
            )}
          </form>

          <div className="flex items-center mb-4">
            <input type="checkbox" id="terms" className="mr-4 w-5 h-5" />
            <label htmlFor="terms" className="text-gray-600 text-base">
              Tôi đồng ý với{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Điều khoản
              </a>{" "}
              và{" "}
              <a href="#" className="text-red-500 hover:underline">
                Chính sách bảo mật
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>

          <p className="text-center text-gray-600 text-lg mt-8">
            Đã có tài khoản?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Đăng nhập
            </a>
          </p>

          <div className="flex items-center my-10">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-6 text-gray-500 text-lg">Hoặc đăng ký bằng</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex justify-center gap-8">
            <button className="flex items-center justify-center w-16 h-16 border rounded-2xl hover:bg-blue-50 transition" type="button">
              <FaFacebook className="text-blue-600 text-3xl" />
            </button>
            <button className="flex items-center justify-center w-16 h-16 border rounded-2xl hover:bg-gray-50 transition" type="button">
              <FaGoogle className="text-red-500 text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
