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

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <>
      <Header />
      <Container>
        <UploadBox onDetectTags={(tags) => setSelectedTags(tags)} />
        <SelectTag
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <TagGroupSection
          title="TAG OPERATOR"
          tags={selectedTags}
          onRemoveTag={handleRemoveTag}
        />
        <OperatorList
          title="OPERATOR POSSIBILITY"
          selectedTags={selectedTags}
        />
      </Container>
      <Footer />
    </>
  );
}
