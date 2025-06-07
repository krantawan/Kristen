"use client";

import OperatorsGrid from "@/app/components/operator/Operators";
import Header from "@/app/components/layout/header/Header";
import Container from "@/app/components/layout/Container";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";
import Footer from "@/app/components/layout/Footer";
import { useTranslations } from "next-intl";

export default function OperatorsPage() {
  const t = useTranslations("components.OperatorsPage");
  return (
    <>
      <Header />
      <Container>
        <PRTSSystemHeader
          version="v2.3"
          user="KRISTEN"
          status="MAINTENANCE"
          title={">> " + t("title")}
          description={t("description")}
        />
        <OperatorsGrid />
      </Container>
      <Footer />
    </>
  );
}
