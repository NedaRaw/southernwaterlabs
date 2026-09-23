import { CheckCircle2, FlaskConical, Wrench, Beaker } from 'lucide-react';

interface InfoSectionProps {
  title: string;
  items: { name: string; description: string }[];
  variant: 'capability' | 'service' | 'analysis';
}

const variantConfig = {
  capability: {
    icon: FlaskConical,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    accent: 'text-teal-700',
    border: 'border-teal-100',
    hoverBorder: 'hover:border-teal-300',
    hoverShadow: 'hover:shadow-teal-200/50',
    checkBg: 'bg-teal-50',
  },
  service: {
    icon: Wrench,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    accent: 'text-cyan-700',
    border: 'border-cyan-100',
    hoverBorder: 'hover:border-cyan-300',
    hoverShadow: 'hover:shadow-cyan-200/50',
    checkBg: 'bg-cyan-50',
  },
  analysis: {
    icon: Beaker,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accent: 'text-blue-700',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
    hoverShadow: 'hover:shadow-blue-200/50',
    checkBg: 'bg-blue-50',
  },
};

export default function InfoSection({ title, items, variant }: InfoSectionProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <h3 className={`text-xl font-bold ${config.accent}`}>{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`group flex items-start gap-3 p-4 rounded-2xl bg-white border ${config.border} ${config.hoverBorder} transition-all duration-300 hover:shadow-lg ${config.hoverShadow}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={`shrink-0 w-8 h-8 rounded-lg ${config.checkBg} flex items-center justify-center mt-0.5`}>
              <CheckCircle2 className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">{item.name}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
