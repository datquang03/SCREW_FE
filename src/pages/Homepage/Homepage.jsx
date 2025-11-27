import React from "react";
import Layout from "../../components/layout/Layout";
import IntroSection from "./components/IntroSection";
import StudioSection from "./components/StudioSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";
import SetDesignSection from "./components/SetDesignSection";

const Homepage = () => {
  return (
    <Layout>
      <IntroSection />
      <StudioSection />
      <SetDesignSection />
      <WhyChooseUsSection />
      <GallerySection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Homepage;