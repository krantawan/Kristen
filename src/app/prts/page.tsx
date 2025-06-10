import LoginVerifyFlow from "@/app/components/arkprts/LoginPRTS";
import ProfileViewer from "@/app/components/arkprts/ProfileViewer";

export default function PrtsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">PRTS Connect</h1>

      <p className="text-sm text-gray-400 mt-4 bg-black text-white p-2">
        หมายเหตุ: ระบบ PRTS Connect นี้ไม่มีการจัดเก็บข้อมูลส่วนตัวใดๆ ทั้งสิ้น{" "}
        <br />
        Session และข้อมูลทั้งหมดเป็นการเชื่อมต่อกับระบบ{" "}
        <a
          href="https://github.com/ashleney/ArkPRTS"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-400"
        >
          https://github.com/ashleney/ArkPRTS
        </a>{" "}
        โดยตรงแบบชั่วคราวเท่านั้น
      </p>
      <LoginVerifyFlow />
      <ProfileViewer />
    </div>
  );
}
