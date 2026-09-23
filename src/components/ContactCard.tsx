import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { ContactInfo } from '@/data/laboratories';

export default function ContactCard({ contact }: { contact: ContactInfo }) {
  const items = [
    { icon: Phone, label: 'الهاتف', value: contact.phone, dir: 'ltr' },
    { icon: Mail, label: 'البريد الإلكتروني', value: contact.email, dir: 'ltr' },
    { icon: MapPin, label: 'العنوان', value: contact.address },
    { icon: Clock, label: 'ساعات العمل', value: contact.workingHours },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-cyan-50/30 border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-cyan-200"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">{item.label}</p>
              <p className="text-sm text-gray-700 font-medium" dir={item.dir as 'ltr' | 'rtl' | undefined}>
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
