import { Outlet } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import React from "react";
import FooterComponent from "./FooterComponent";
export default function Layout() {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <Outlet />
      <FooterComponent></FooterComponent>
    </div>
  );
}
