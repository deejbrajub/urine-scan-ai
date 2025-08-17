import { Microscope, Activity, FileText } from "lucide-react";

const MedicalHeader = () => {
  return (
    <header className="bg-gradient-medical border-b border-border shadow-medical">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Microscope className="h-8 w-8 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                UrineVision AI
              </h1>
              <p className="text-sm text-primary-foreground/80">
                Automated Urine Sediment Analysis System
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-primary-foreground/10 rounded-lg">
              <Activity className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;