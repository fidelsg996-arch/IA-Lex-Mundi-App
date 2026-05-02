import React from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";

const Home = () => {
  return (
    <Layout>
      <Header />
      <Dashboard />
    </Layout>
  );
};

export default Home;