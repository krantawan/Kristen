"use client";

import { useState } from "react";
import Header from "@/app/components/layout/header/Header";
import Container from "@/app/components/layout/Container";
import UploadBox from "@/app/components/upload/UploadBox";
import SelectTag from "@/app/components/tag/SelectTag";
import TagGroupSection from "@/app/components/tag/TagGroupSection";
import OperatorList from "@/app/components/operator/OperatorList";
import Footer from "@/app/components/layout/Footer";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";

export default function Page() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <>
      <Header />
      <Container title="Recruitment">
        {/* SECTION: SYSTEM HEADER / INTRO */}
        <PRTSSystemHeader version="v2.3" user="DOCTOR" status="ONLINE" />

        {/* SECTION: TOOLS */}
        <SelectTag
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <UploadBox onDetectTags={(tags) => setSelectedTags(tags)} />

        {/* SECTION: RESULT */}
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
