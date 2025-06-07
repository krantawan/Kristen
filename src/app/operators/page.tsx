"use client";

import OperatorsGrid from "@/app/components/operator/Operators";
import Header from "@/app/components/layout/header/Header";
import Container from "@/app/components/layout/Container";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";
import Footer from "@/app/components/layout/Footer";

export default function OperatorsPage() {
  return (
    <>
      <Header />
      <Container>
        <PRTSSystemHeader
          version="v2.3"
          user="KRISTEN"
          status="MAINTENANCE"
          title={">> ALL OPERATORS"}
          description={
            "Use AI-assisted scan or manual tag selection to identify compatible operators."
          }
        />
        <OperatorsGrid />
      </Container>
      <Footer />
    </>
  );
}
