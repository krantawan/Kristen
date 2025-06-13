"use client";

import Header from "@/app/components/layout/header/Header";
import Container from "@/app/components/layout/Container";
import Footer from "@/app/components/layout/Footer";
import EventTimeline from "@/app/components/event/EventTimeline";
import EventSummarySection from "@/app/components/event/EventSummarySection";
import EventCurrentBanner from "@/app/components/event/EventCurrentBanner";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";
import DataMineSection from "@/app/components/event/DataMineSection";

export default function EventsPage() {
  return (
    <>
      <Header />
      <Container title="Events">
        <PRTSSystemHeader version="v2.3" user="KRISTEN" status="ONLINE" />
        <EventCurrentBanner />

        <div className="w-full max-w-full overflow-x-auto">
          <EventTimeline />
          <EventSummarySection />
          <DataMineSection />
        </div>
      </Container>
      <Footer />
    </>
  );
}
