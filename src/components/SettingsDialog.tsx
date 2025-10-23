import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Settings, Trash2, Droplet, Filter, Wrench, Zap, Fan, AlertTriangle, Gauge, Wind, Disc, Cog } from 'lucide-react';
import { MaintenanceType } from '../App';
import { toast } from 'sonner@2.0.3';
import { Card } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface SettingsDialogProps {
  maintenanceTypes: MaintenanceType[];
  onUpdate: (id: string, updates: Partial<MaintenanceType>) => void;
  onDelete: (id: string) => void;
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

export function SettingsDialog({ maintenanceTypes, onUpdate, onDelete }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInterval, setEditInterval] = useState('');

  const handleStartEdit = (maintenance: MaintenanceType) => {
    setEditingId(maintenance.id);
    setEditInterval(maintenance.interval.toString());
  };

  const handleSaveEdit = (id: string) => {
    const interval = parseInt(editInterval);
    if (isNaN(interval) || interval <= 0) {
      toast.error('Por favor ingresa un intervalo válido');
      return;
    }

    onUpdate(id, { interval });
    toast.success('Intervalo actualizado');
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast.success(`${name} eliminado`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuración de Mantenimientos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {maintenanceTypes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No hay mantenimientos configurados</p>
              <p className="text-slate-500">Añade un nuevo tipo de mantenimiento para comenzar</p>
            </div>
          ) : (
            maintenanceTypes.map((maintenance) => {
              const IconComponent = iconMap[maintenance.icon] || Wrench;
              const isEditing = editingId === maintenance.id;

              return (
                <Card key={maintenance.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="w-5 h-5 text-slate-600" />
                      <div className="flex-1">
                        <h4 className="text-slate-900">{maintenance.name}</h4>
                        {isEditing ? (
                          <div className="flex items-center gap-2 mt-2">
                            <Input
                              type="number"
                              value={editInterval}
                              onChange={(e) => setEditInterval(e.target.value)}
                              className="w-32"
                              placeholder="Intervalo"
                            />
                            <span className="text-slate-600">km</span>
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveEdit(maintenance.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Guardar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <p className="text-slate-600">
                            Intervalo: {maintenance.interval.toLocaleString()} km
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStartEdit(maintenance)}
                          >
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar mantenimiento?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Se eliminará "{maintenance.name}" y su historial. Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(maintenance.id, maintenance.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
