"use client";

import Header from "@/app/components/layout/header/Header";
import Container from "@/app/components/layout/Container";
import Footer from "@/app/components/layout/Footer";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";
import GachaSimulator from "@/app/components/gacha/GachaSimulator";

export default function GachaSimulatorPage() {
  return (
    <>
      <Header />
      <Container title="Headhunting Simulator">
        <PRTSSystemHeader version="v2.3" user="KRISTEN" status="MAINTENANCE" />
        <GachaSimulator />
      </Container>
      <Footer />
    </>
  );
}
