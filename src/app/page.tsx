"use client";

import { useState } from "react";
import Header from "@/app/components/layout/Header";
import Container from "@/app/components/layout/Container";
import UploadBox from "@/app/components/upload/UploadBox";
import SelectTag from "@/app/components/tag/SelectTag";
import TagGroupSection from "@/app/components/tag/TagGroupSection";
import OperatorList from "@/app/components/operator/OperatorList";
import Footer from "@/app/components/layout/Footer";

export default function Page() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <>
      <Header />
      <Container>
        <UploadBox />
        <SelectTag selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

        <div className="mt-6 p-2">
          <TagGroupSection title="TAG OPERATOR" tags={selectedTags} />
          <OperatorList title="OPERATOR POSSIBILITY" selectedTags={selectedTags} />
        </div>
      </Container>
      <Footer />
    </>
  );
}
