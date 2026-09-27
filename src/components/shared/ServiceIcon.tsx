import { FileText, Heart, ShieldCheck, Copy, Award, LandPlot, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Heart,
  ShieldCheck,
  Copy,
  Award,
  LandPlot,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? FileText;
  return <Icon className={className} />;
}
