import { getAllOperatorsWithSource } from "@/lib/loadAllOperators";
import OperatorsGrid from "@/app/components/operator/Operators";
import Header from "@/app/components/layout/header/Header";
import Container from "@/app/components/layout/Container";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";
import Footer from "@/app/components/layout/Footer";

export default async function OperatorsPage() {
  const operators = await getAllOperatorsWithSource();

  return (
    <>
      <Header />
      <Container title="Operators">
        <PRTSSystemHeader version="v2.3" user="KRISTEN" status="MAINTENANCE" />
        <OperatorsGrid operators={operators} />
      </Container>
      <Footer />
    </>
  );
}
