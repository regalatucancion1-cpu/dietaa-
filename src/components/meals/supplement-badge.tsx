import type { Supplement } from "@/types/diet";

const SUPPLEMENT_STYLES: Record<string, { bg: string; text: string }> = {
  "bg-green-500": { bg: "bg-[#F0FDF4]", text: "text-[#65a30d]" },
  "bg-blue-500": { bg: "bg-[#F0FDF4]", text: "text-[#65a30d]" },
  "bg-yellow-500": { bg: "bg-[#F0FDF4]", text: "text-[#65a30d]" },
  "bg-red-500": { bg: "bg-orange-50", text: "text-orange-500" },
  "bg-orange-500": { bg: "bg-orange-50", text: "text-orange-500" },
};

interface SupplementBadgeProps {
  supplement: Supplement;
}

export function SupplementBadge({ supplement }: SupplementBadgeProps) {
  const style = SUPPLEMENT_STYLES[supplement.color] ?? {
    bg: "bg-[#F0FDF4]",
    text: "text-[#65a30d]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${style.bg} ${style.text}`}
    >
      {supplement.dosage} {supplement.name}
    </span>
  );
}
