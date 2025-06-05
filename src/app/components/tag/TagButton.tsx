import { useTranslations } from "next-intl";

export default function TagButton({
  label,
  className = "",
  onClick,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  const t = useTranslations("components.RecruitmentPage.taglist");
  return (
    <div className="flex items-center gap-2">
      <button
        className={`bg-[#222] px-4 py-2 font-bold text-sm cursor-pointer ${className}`}
        onClick={onClick}
        title={t(label)}
      >
        {t(label)}
      </button>
    </div>
  );
}
