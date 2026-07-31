import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>{value}</p>
          <p className="text-xs" style={{ color: '#64748B' }}>{title}</p>
        </div>
      </div>
      {trend && (
        <p className="text-xs mt-2" style={{ color: '#10B981' }}>{trend}</p>
      )}
    </div>
  );
}