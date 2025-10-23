import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Droplet, Filter, Wrench, Zap, Fan, AlertTriangle, Gauge, Wind, Disc, Cog } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddMaintenanceDialogProps {
  onAdd: (maintenance: { name: string; icon: string; color: string; interval: number }) => void;
}

const iconOptions = [
  { value: 'droplet', label: 'Gota', Icon: Droplet },
  { value: 'filter', label: 'Filtro', Icon: Filter },
  { value: 'wrench', label: 'Llave', Icon: Wrench },
  { value: 'zap', label: 'Batería', Icon: Zap },
  { value: 'fan', label: 'Ventilador', Icon: Fan },
  { value: 'disc', label: 'Disco', Icon: Disc },
  { value: 'wind', label: 'Aire', Icon: Wind },
  { value: 'gauge', label: 'Medidor', Icon: Gauge },
  { value: 'cog', label: 'Engranaje', Icon: Cog },
  { value: 'alert', label: 'Alerta', Icon: AlertTriangle },
];

const colorOptions = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'purple', label: 'Púrpura', class: 'bg-purple-500' },
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'red', label: 'Rojo', class: 'bg-red-500' },
  { value: 'orange', label: 'Naranja', class: 'bg-orange-500' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-500' },
  { value: 'yellow', label: 'Amarillo', class: 'bg-yellow-500' },
];

export function AddMaintenanceDialog({ onAdd }: AddMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('wrench');
  const [color, setColor] = useState('blue');
  const [interval, setInterval] = useState('10000');

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Por favor ingresa un nombre');
      return;
    }

    const intervalNum = parseInt(interval);
    if (isNaN(intervalNum) || intervalNum <= 0) {
      toast.error('Por favor ingresa un intervalo válido');
      return;
    }

    onAdd({
      name: name.trim(),
      icon,
      color,
      interval: intervalNum,
    });

    toast.success('Tipo de mantenimiento añadido');
    setOpen(false);
    setName('');
    setIcon('wrench');
    setColor('blue');
    setInterval('10000');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Mantenimiento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Tipo de Mantenimiento</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del mantenimiento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Cambio de frenos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icono</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.Icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${option.class}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interval">Intervalo (km)</Label>
            <Input
              id="interval"
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              placeholder="Ej: 10000"
            />
            <p className="text-slate-500">Cada cuántos kilómetros realizar este mantenimiento</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
