"use client";

import Header from "@/app/components/layout/Header";
import Container from "@/app/components/layout/Container";
import Footer from "@/app/components/layout/Footer";
import EventTimeline from "@/app/components/event/EventTimeline";
import EventSummarySection from "@/app/components/event/EventSummarySection";
import EventCurrentBanner from "@/app/components/event/EventCurrentBanner";

export default function EventsPage() {
  return (
    <>
      <Header />
      <Container>
        <EventCurrentBanner />

        <div className="w-full max-w-full overflow-x-auto">
          <EventTimeline />
          <EventSummarySection />
        </div>
      </Container>
      <Footer />
    </>
  );
}
