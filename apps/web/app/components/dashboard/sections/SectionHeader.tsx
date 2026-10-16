interface SectionHeaderProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export function SectionHeader({ title, buttonLabel, onButtonClick }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      {buttonLabel && (
        <button
          type="button"
          onClick={onButtonClick}
          className="bg-black text-white text-sm font-semibold tracking-wide px-5 py-2.5 hover:bg-neutral-800 transition"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
