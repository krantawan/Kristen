import Container from "@/app/components/layout/Container"
import Header from "@/app/components/layout/Header"
import Footer from "@/app/components/layout/Footer"
import UploadBox from "@/app/components/upload/UploadBox"
import TagGroupSection from "./components/tag/TagGroupSection";
import OperatorList from "./components/operator/OperatorList";

const sampleTags = [
  "Top Operator", "Support", "DPS", "Healing", "Survival",
  "Slow", "AoE", "Starter", "Debuff", "Defense", "Nuker",
]

export default function Home() {
  return (
    <>
    <Header />
    <Container>
      <UploadBox />
      <div className="mt-6 p-2">
        <TagGroupSection title="TAG OPERATOR" tags={sampleTags} />
        <OperatorList title="OPERATOR POSSIBILITY" />
      </div>
    </Container>
    <Footer />
    </>
  );
}
