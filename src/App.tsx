import { useState, useEffect } from 'react';
import { VehicleStats } from './components/VehicleStats';
import { UpdateKilometers } from './components/UpdateKilometers';
import { SettingsDialog } from './components/SettingsDialog';
import { HistoryList } from './components/HistoryList';
import { AddMaintenanceDialog } from './components/AddMaintenanceDialog';
import { ThemeToggle } from './components/ThemeToggle';
import { SplashCursor } from './components/SplashCursor';
import { Car, Plus } from 'lucide-react';
import { Button } from './components/ui/button';

export interface MaintenanceType {
  id: string;
  name: string;
  icon: string;
  color: string;
  interval: number;
  lastChangeKm: number;
}

export interface VehicleData {
  currentKm: number;
  maintenanceTypes: MaintenanceType[];
}

export interface ChangeHistory {
  id: string;
  date: string;
  km: number;
  maintenanceId: string;
  maintenanceName: string;
}

const defaultMaintenanceTypes: MaintenanceType[] = [
  {
    id: 'oil',
    name: 'Aceite',
    icon: 'droplet',
    color: 'blue',
    interval: 10000,
    lastChangeKm: 10000,
  },
  {
    id: 'filter',
    name: 'Filtro de Aceite',
    icon: 'filter',
    color: 'purple',
    interval: 20000,
    lastChangeKm: 10000,
  },
];

const defaultData: VehicleData = {
  currentKm: 15000,
  maintenanceTypes: defaultMaintenanceTypes,
};

export default function App() {
  const [vehicleData, setVehicleData] = useState<VehicleData>(defaultData);
  const [history, setHistory] = useState<ChangeHistory[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('vehicleData');
    const savedHistory = localStorage.getItem('changeHistory');
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedData) {
      setVehicleData(JSON.parse(savedData));
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vehicleData', JSON.stringify(vehicleData));
  }, [vehicleData]);

  useEffect(() => {
    localStorage.setItem('changeHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleUpdateKilometers = (newKm: number) => {
    setVehicleData(prev => ({ ...prev, currentKm: newKm }));
  };

  const handleMaintenanceChange = (maintenanceId: string, km: number) => {
    setVehicleData(prev => ({
      ...prev,
      currentKm: km,
      maintenanceTypes: prev.maintenanceTypes.map(m =>
        m.id === maintenanceId ? { ...m, lastChangeKm: km } : m
      ),
    }));

    const maintenance = vehicleData.maintenanceTypes.find(m => m.id === maintenanceId);
    if (maintenance) {
      addToHistory(km, maintenanceId, maintenance.name);
    }
  };

  const handleMultipleChange = (maintenanceIds: string[], km: number) => {
    setVehicleData(prev => ({
      ...prev,
      currentKm: km,
      maintenanceTypes: prev.maintenanceTypes.map(m =>
        maintenanceIds.includes(m.id) ? { ...m, lastChangeKm: km } : m
      ),
    }));

    maintenanceIds.forEach(id => {
      const maintenance = vehicleData.maintenanceTypes.find(m => m.id === id);
      if (maintenance) {
        addToHistory(km, id, maintenance.name);
      }
    });
  };

  const addToHistory = (km: number, maintenanceId: string, maintenanceName: string) => {
    const newEntry: ChangeHistory = {
      id: Date.now().toString() + Math.random(),
      date: new Date().toISOString(),
      km,
      maintenanceId,
      maintenanceName,
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 20));
  };

  const handleAddMaintenance = (maintenance: Omit<MaintenanceType, 'id' | 'lastChangeKm'>) => {
    const newMaintenance: MaintenanceType = {
      ...maintenance,
      id: Date.now().toString(),
      lastChangeKm: vehicleData.currentKm,
    };
    setVehicleData(prev => ({
      ...prev,
      maintenanceTypes: [...prev.maintenanceTypes, newMaintenance],
    }));
  };

  const handleUpdateMaintenance = (id: string, updates: Partial<MaintenanceType>) => {
    setVehicleData(prev => ({
      ...prev,
      maintenanceTypes: prev.maintenanceTypes.map(m =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  };

  const handleDeleteMaintenance = (id: string) => {
    setVehicleData(prev => ({
      ...prev,
      maintenanceTypes: prev.maintenanceTypes.filter(m => m.id !== id),
    }));
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <>
      <SplashCursor />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white">Control de Mantenimiento</h1>
              <p className="text-slate-600 dark:text-slate-400">Gestión de servicios del vehículo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
            <AddMaintenanceDialog onAdd={handleAddMaintenance} />
            <SettingsDialog 
              maintenanceTypes={vehicleData.maintenanceTypes}
              onUpdate={handleUpdateMaintenance}
              onDelete={handleDeleteMaintenance}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Section */}
          <div className="lg:col-span-2">
            <VehicleStats 
              currentKm={vehicleData.currentKm}
              maintenanceTypes={vehicleData.maintenanceTypes}
              onMaintenanceChange={handleMaintenanceChange}
              onMultipleChange={handleMultipleChange}
              onUpdateKm={handleUpdateKilometers}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UpdateKilometers 
              currentKm={vehicleData.currentKm}
              onUpdate={handleUpdateKilometers}
            />
            <HistoryList history={history} />
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
