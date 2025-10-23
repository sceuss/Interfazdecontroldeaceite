import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { History, Droplet, Filter, Wrench, Zap, Fan, AlertTriangle, Gauge, Wind, Disc, Cog } from 'lucide-react';
import { ChangeHistory } from '../App';

interface HistoryListProps {
  history: ChangeHistory[];
}

const iconMap: Record<string, any> = {
  droplet: Droplet,
  filter: Filter,
  wrench: Wrench,
  zap: Zap,
  fan: Fan,
  disc: Disc,
  wind: Wind,
  gauge: Gauge,
  cog: Cog,
  alert: AlertTriangle,
};

export function HistoryList({ history }: HistoryListProps) {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-6 shadow-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
          <History className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white">Historial</h3>
          <p className="text-slate-600 dark:text-slate-400">Últimos cambios</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-slate-100 dark:bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">Sin registros aún</p>
          <p className="text-slate-400 dark:text-slate-500">Los cambios aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((entry) => {
            const IconComponent = iconMap[entry.maintenanceId] || Wrench;
            
            return (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <IconComponent className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white">{entry.km.toLocaleString()} km</p>
                    <p className="text-slate-500 dark:text-slate-400">{formatDate(entry.date)}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                  {entry.maintenanceName}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
