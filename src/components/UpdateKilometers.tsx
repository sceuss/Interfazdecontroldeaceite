import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Gauge, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UpdateKilometersProps {
  currentKm: number;
  onUpdate: (newKm: number) => void;
}

export function UpdateKilometers({ currentKm, onUpdate }: UpdateKilometersProps) {
  const [inputValue, setInputValue] = useState(currentKm.toString());

  const handleUpdate = () => {
    const newKm = parseInt(inputValue);
    if (isNaN(newKm) || newKm < 0) {
      toast.error('Por favor ingresa un valor válido');
      return;
    }
    if (newKm < currentKm) {
      toast.error('El kilometraje no puede ser menor al actual');
      return;
    }
    onUpdate(newKm);
    toast.success('Kilometraje actualizado correctamente');
  };

  const addQuickKm = (amount: number) => {
    const newKm = currentKm + amount;
    setInputValue(newKm.toString());
    onUpdate(newKm);
    toast.success(`+${amount} km añadidos`);
  };

  return (
    <Card className="p-6 shadow-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white">Actualizar Kilometraje</h3>
          <p className="text-slate-600 dark:text-slate-400">Registro de recorrido</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="kilometers">Kilometraje actual</Label>
          <Input
            id="kilometers"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ej: 15000"
            className="mt-1.5"
          />
        </div>

        <Button 
          onClick={handleUpdate} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Actualizar
        </Button>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400 mb-3">Acciones rápidas</p>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addQuickKm(100)}
              className="text-slate-700 dark:text-slate-300"
            >
              +100
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addQuickKm(500)}
              className="text-slate-700 dark:text-slate-300"
            >
              +500
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addQuickKm(1000)}
              className="text-slate-700 dark:text-slate-300"
            >
              +1000
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
