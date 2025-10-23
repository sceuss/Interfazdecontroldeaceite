import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface ConfirmChangeDialogProps {
  maintenanceName: string;
  currentKm: number;
  onConfirm: (km: number) => void;
  triggerButton: React.ReactNode;
}

export function ConfirmChangeDialog({ maintenanceName, currentKm, onConfirm, triggerButton }: ConfirmChangeDialogProps) {
  const [open, setOpen] = useState(false);
  const [km, setKm] = useState(currentKm.toString());

  const handleConfirm = () => {
    const kmValue = parseInt(km);
    if (isNaN(kmValue) || kmValue < 0) {
      toast.error('Por favor ingresa un kilometraje válido');
      return;
    }
    if (kmValue < currentKm) {
      toast.error('El kilometraje no puede ser menor al actual');
      return;
    }
    
    onConfirm(kmValue);
    toast.success('Cambio registrado correctamente');
    setOpen(false);
    setKm(currentKm.toString());
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {triggerButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Cambio</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a registrar el cambio de {maintenanceName}. Confirma el kilometraje en el que se realizó.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="confirm-km">Kilometraje del cambio</Label>
          <Input
            id="confirm-km"
            type="number"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            className="mt-1.5"
            placeholder="Ej: 15000"
          />
          <p className="text-slate-500 mt-2">Kilometraje actual: {currentKm.toLocaleString()} km</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
            Confirmar Cambio
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
