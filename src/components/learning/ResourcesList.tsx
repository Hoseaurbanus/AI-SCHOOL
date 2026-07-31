import { FileText, Archive, ExternalLink, Download } from 'lucide-react';
import type { Resource } from '../../types';

interface ResourcesListProps {
  resources: Resource[];
}

const iconMap = {
  pdf: FileText,
  zip: Archive,
  link: ExternalLink,
};

const colorMap = {
  pdf: '#EF4444',
  zip: '#F59E0B',
  link: '#3B82F6',
};

export default function ResourcesList({ resources }: ResourcesListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm" style={{ color: '#64748B' }}>No resources available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((resource) => {
        const Icon = iconMap[resource.type];
        const color = colorMap[resource.type];

        return (
          <div
            key={resource.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            style={{ background: '#060A12', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#F1F5F9' }}>
                {resource.title}
              </p>
              {resource.size && (
                <p className="text-xs" style={{ color: '#64748B' }}>{resource.size}</p>
              )}
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all"
              style={{ color: '#3B82F6' }}
            >
              <Download size={16} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
