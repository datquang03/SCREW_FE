import React from "react";
import Layout from "../../components/layout/Layout";
import IntroSection from "./components/IntroSection";
const Homepage = () => {
  return (
    <Layout>
      <div className="h-screen text-center w-full">
        <IntroSection />
      </div>
    </Layout>
  );
};

export default Homepage;
