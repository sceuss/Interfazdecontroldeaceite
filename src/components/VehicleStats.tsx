import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Droplet, Filter, Wrench, Zap, Fan, AlertTriangle, Gauge, Wind, Disc, Cog } from 'lucide-react';
import { MaintenanceType } from '../App';
import { ConfirmChangeDialog } from './ConfirmChangeDialog';

interface VehicleStatsProps {
  currentKm: number;
  maintenanceTypes: MaintenanceType[];
  onMaintenanceChange: (maintenanceId: string, km: number) => void;
  onMultipleChange: (maintenanceIds: string[], km: number) => void;
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

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
};

export function VehicleStats({ currentKm, maintenanceTypes, onMaintenanceChange, onMultipleChange }: VehicleStatsProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-red-500';
    if (progress >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return 'text-red-600';
    if (progress >= 80) return 'text-amber-600';
    return 'text-green-600';
  };

  const maintenancesNeedingChange = maintenanceTypes.filter(m => {
    const kmSinceChange = currentKm - m.lastChangeKm;
    const progress = (kmSinceChange / m.interval) * 100;
    return progress >= 100;
  });

  return (
    <div className="space-y-6">
      {/* Current Kilometers Display */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-1">Kilometraje Actual</p>
            <p className="text-white">{currentKm.toLocaleString()} km</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </Card>

      {/* Maintenance Cards */}
      {maintenanceTypes.map((maintenance) => {
        const kmSinceChange = currentKm - maintenance.lastChangeKm;
        const progress = Math.min((kmSinceChange / maintenance.interval) * 100, 100);
        const kmRemaining = Math.max(maintenance.interval - kmSinceChange, 0);
        const needsChange = progress >= 100;
        const warning = progress >= 80 && progress < 100;

        const IconComponent = iconMap[maintenance.icon] || Wrench;
        const colors = colorMap[maintenance.color] || colorMap.blue;

        return (
          <Card key={maintenance.id} className="p-6 shadow-lg border-slate-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${needsChange ? 'bg-red-100' : warning ? 'bg-amber-100' : colors.bg}`}>
                  <IconComponent className={`w-6 h-6 ${needsChange ? 'text-red-600' : warning ? 'text-amber-600' : colors.text}`} />
                </div>
                <div>
                  <h3 className="text-slate-900 mb-1">{maintenance.name}</h3>
                  <p className="text-slate-600">{kmSinceChange.toLocaleString()} km recorridos</p>
                </div>
              </div>
              <Badge variant={needsChange ? "destructive" : warning ? "outline" : "default"}
                     className={needsChange ? '' : warning ? 'border-amber-500 text-amber-700' : `${colors.bg} ${colors.text} ${colors.border}`}>
                {needsChange ? 'CAMBIO REQUERIDO' : warning ? 'PRÓXIMO' : 'OK'}
              </Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3" />
                <div 
                  className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(progress)}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Último cambio: {maintenance.lastChangeKm.toLocaleString()} km</span>
                <span className={getStatusColor(progress)}>
                  {needsChange ? '¡Cambiar ahora!' : `${kmRemaining.toLocaleString()} km restantes`}
                </span>
              </div>
            </div>

            <ConfirmChangeDialog
              maintenanceName={maintenance.name}
              currentKm={currentKm}
              onConfirm={(km) => onMaintenanceChange(maintenance.id, km)}
              triggerButton={
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Cambio de {maintenance.name}
                </Button>
              }
            />
          </Card>
        );
      })}

      {/* Quick Action - Multiple Changes */}
      {maintenancesNeedingChange.length > 1 && (
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl border-0">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-1" />
            <div>
              <h3 className="text-white mb-1">Cambio Múltiple</h3>
              <p className="text-slate-300">
                {maintenancesNeedingChange.length} mantenimientos requieren cambio
              </p>
              <ul className="text-slate-300 mt-2 space-y-1">
                {maintenancesNeedingChange.map(m => (
                  <li key={m.id}>• {m.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <ConfirmChangeDialog
            maintenanceName="todos los mantenimientos seleccionados"
            currentKm={currentKm}
            onConfirm={(km) => onMultipleChange(maintenancesNeedingChange.map(m => m.id), km)}
            triggerButton={
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Todos los Cambios
              </Button>
            }
          />
        </Card>
      )}

      {maintenanceTypes.length === 0 && (
        <Card className="p-12 text-center shadow-lg border-slate-200">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">No hay mantenimientos configurados</h3>
          <p className="text-slate-600">Añade tu primer tipo de mantenimiento para comenzar</p>
        </Card>
      )}
    </div>
  );
}
