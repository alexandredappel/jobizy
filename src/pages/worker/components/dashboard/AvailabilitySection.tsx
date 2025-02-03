import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

interface AvailabilitySectionProps {
  isAvailable: boolean;
  onToggleAvailability: (value: boolean) => Promise<void>;
}

const AvailabilitySection = ({ isAvailable, onToggleAvailability }: AvailabilitySectionProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">{t('worker.dashboard.availability.title')}</h2>
          <p className="text-muted-foreground">
            {isAvailable 
              ? t('worker.dashboard.availability.available')
              : t('worker.dashboard.availability.unavailable')
            }
          </p>
        </div>
        <Switch
          checked={isAvailable}
          onCheckedChange={onToggleAvailability}
          className="scale-125"
        />
      </div>
    </Card>
  );
};

export default AvailabilitySection;