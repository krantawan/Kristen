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
      <Container>
        <PRTSSystemHeader
          version="v2.3"
          user="KRISTEN"
          status="MAINTENANCE"
          title={"Headhunting Simulator v.beta"}
          description="Simulate pulls with full pity and guarantee system. See your luck on any banner!"
        />
        <GachaSimulator />
      </Container>
      <Footer />
    </>
  );
}
