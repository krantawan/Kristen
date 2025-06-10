import LoginVerifyFlow from "@/app/components/arkprts/LoginPRTS";
import ProfileViewer from "@/app/components/arkprts/ProfileViewer";

export default function PrtsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">PRTS Connect</h1>
      <LoginVerifyFlow />
      <ProfileViewer />
    </div>
  );
}
