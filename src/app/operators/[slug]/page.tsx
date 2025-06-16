import { notFound } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import operators from "@/data/operators.json";
import Header from "@/app/components/layout/header/Header";
import PRTSSystemHeader from "@/components/ui/PRTSSystemHeader";
import Footer from "@/app/components/layout/Footer";
import Container from "@/app/components/layout/Container";

// Dynamic import with loading component
const OperatorPageClient = dynamic(
  () => import("@/app/components/operator/OperatorDetail"),
  {
    loading: () => <OperatorDetailSkeleton />,
    ssr: true,
  }
);

// Optimized skeleton component
function OperatorDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded-md mb-2 animate-pulse"></div>
      <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-md mb-6 animate-pulse"></div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[50%] xl:w-[45%]">
          <div className="aspect-[3/4] bg-gray-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
        </div>
        <div className="flex-1">
          <div className="h-full bg-gray-100 dark:bg-zinc-900 rounded-md p-6">
            <div className="h-10 w-full bg-gray-200 dark:bg-zinc-800 rounded-md mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const createSlugLookup = () => {
  const lookup = new Map();
  operators.forEach((op) => {
    const slug = toSlug(op.name);
    lookup.set(slug, op);
  });
  return lookup;
};

// Cache the lookup map
const slugLookup = createSlugLookup();

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

// Pre-generate all static params at build time
export async function generateStaticParams() {
  // Return all possible slugs for static generation
  return operators.map((op) => ({
    slug: toSlug(op.name),
  }));
}

// Add metadata generation for better SEO and performance
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const operator = slugLookup.get(slug);

  if (!operator) {
    return {
      title: "Operator Not Found",
      description: "The requested operator could not be found.",
    };
  }

  return {
    title: `${operator.name} - Arknights Operator`,
    description: `View detailed information about ${operator.name}, including stats, skills, and skins.`,
    openGraph: {
      title: `${operator.name} - Arknights Operator`,
      description: `View detailed information about ${operator.name}`,
      // Add operator image if available
      // images: [{ url: getOperatorImageUrl(operator) }],
    },
  };
}

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Use O(1) lookup instead of O(n) find
  const operator = slugLookup.get(slug);

  // Return 404 if operator not found
  if (!operator) {
    notFound();
  }

  return (
    <>
      <Header />
      <Container title={operator.name}>
        <PRTSSystemHeader version="v2.3" user="KRISTEN" status="ONLINE" />
        <Suspense fallback={<OperatorDetailSkeleton />}>
          <OperatorPageClient operator={operator} />
        </Suspense>
      </Container>
      <Footer />
    </>
  );
}
