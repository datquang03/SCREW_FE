import React from "react";
import IntroSection from "./components/IntroSection";
import StudioSection from "./components/StudioSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";
import SetDesignSection from "./components/SetDesignSection";

const Homepage = () => {
  return (
    <>
      <IntroSection />
      <StudioSection />
      <SetDesignSection />
      <WhyChooseUsSection />
      <GallerySection />
      <TestimonialsSection />
    </>
  );
};

export default Homepage;