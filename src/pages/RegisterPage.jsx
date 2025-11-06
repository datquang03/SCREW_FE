import React from "react";
import logo from "../../../assets/S+logo.png";
import AnimatedBackground from "../../../components/animatedBackground";
import PageTransition from "../../../components/PageTransition";
import AuthForm from "../../../components/AuthForm";

const RegisterPage = () => {
  return (
    <AnimatedBackground>
      <PageTransition>
        <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center">
          <img src={logo} alt="S+" className="w-20 mb-6 drop-shadow-xl" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">THAM GIA NGAY!</h2>
          <p className="mb-6 text-gray-500">Chỉ 30 giây để bắt đầu</p>
          <AuthForm
            type="register"
            onFinish={() => alert("Đăng ký thành công!")}
          />
        </div>
      </PageTransition>
    </AnimatedBackground>
  );
};

export default RegisterPage;