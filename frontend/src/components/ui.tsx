import type { ReactNode } from "react";

export function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  }) {
  return (
    <section className={`rounded-[1.75rem] border border-white/20 bg-white/85 p-5 shadow-[0_28px_90px_-44px_rgba(15,23,42,0.38)] ring-1 ring-white/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 dark:ring-slate-900/60 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
  }) {
  return (
    <div className="rounded-[1.75rem] border border-white/20 bg-white/85 p-4 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.3)] ring-1 ring-white/40 dark:border-slate-800 dark:bg-slate-950/75 dark:ring-slate-900/60">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function ProgressRing({
  value,
  size = 160,
  label,
}: {
  value: number;
  size?: number;
  label: string;
}) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.18)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="-mt-[108px] flex flex-col items-center">
        <span className="text-4xl font-semibold text-slate-950 dark:text-white">{Math.round(value)}</span>
        <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">{label}</span>
      </div>
    </div>
  );
}

export function VerticalBars({
  items,
}: {
  items: Array<{ label: string; value: number }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
            <span className="font-medium text-slate-950 dark:text-white">{item.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-400"
              style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CodeBlock({ value }: { value: string }) {
  return (
    <pre className="overflow-x-auto rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-3 text-sm text-slate-100 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.9)] dark:border-slate-800">
      <code>{value}</code>
    </pre>
  );
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-500/15"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-500/15"
      />
    </label>
  );
}

export function ActionButton({
  children,
  onClick,
  secondary = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-4";
  const variant = secondary
    ? "border border-slate-200 bg-white text-slate-950 hover:border-slate-300 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800"
    : "bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-lg shadow-blue-900/15 hover:brightness-110 focus:ring-sky-200";
  return (
    <button type={type} onClick={onClick} className={`${base} ${variant}`}>
      {children}
    </button>
  );
}
