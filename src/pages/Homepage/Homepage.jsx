import React from "react";
import Layout from "../../components/layout/Layout";
import IntroSection from "./components/IntroSection";
import StudioSection from "./components/StudioSection";
const Homepage = () => {
  return (
    <Layout>
      <div className="h-screen text-center w-full">
        <IntroSection />
      </div>
      <div>
        <StudioSection />
      </div>
    </Layout>
  );
};

export default Homepage;
