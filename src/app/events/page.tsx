"use client";

import Header from "@/app/components/layout/Header";
import Container from "@/app/components/layout/Container";
import Footer from "@/app/components/layout/Footer";
import EventTimeline from "@/app/components/event/EventTimeline";

export default function EventsPage() {
  return (
    <>
      <Header />
      <Container>
        <div className="bg-[#222] px-2 pt-3 pb-1">
          {/* Header Bar */}
          <div className="flex items-center">
            <div className="h-1 w-6 bg-[#BEC93B]" />
            <div className="h-1 w-6 bg-[#F6B347]" />
            <div className="h-1 w-6 bg-[#802520]" />
          </div>

          {/* Title */}
          <h2 className="text-4xl font-black tracking-tight mb-2 font-roboto text-white">
            Events
          </h2>
        </div>
        <div className="w-full max-w-full overflow-x-auto">
          <EventTimeline />
        </div>
      </Container>
      <Footer />
    </>
  );
}
