import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Microscope, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Eye,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CellCount {
  type: 'RBC' | 'Cast' | 'Urothelial';
  count: number;
  confidence: number;
  normal_range: string;
  status: 'normal' | 'elevated' | 'critical';
}

interface AnalysisResultsProps {
  imageName: string;
  results: CellCount[];
  processingTime: number;
  overallAccuracy: number;
  detectedAnomalies: string[];
  preliminaryDiagnosis: string[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  imageName,
  results,
  processingTime,
  overallAccuracy,
  detectedAnomalies,
  preliminaryDiagnosis
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-success';
      case 'elevated':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'normal':
        return 'default';
      case 'elevated':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4" />;
      case 'elevated':
        return <AlertTriangle className="h-4 w-4" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card-medical border-primary/20">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Microscope className="h-5 w-5 text-primary" />
              <span>Analysis Complete: {imageName}</span>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success">
              <Activity className="mr-1 h-3 w-3" />
              {processingTime.toFixed(1)}s
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Overall Detection Accuracy</span>
            </div>
            <span className="text-lg font-bold text-primary">{overallAccuracy}%</span>
          </div>
          <Progress value={overallAccuracy} className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <Card key={index} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{result.type} Cells</h4>
                    {getStatusIcon(result.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-2xl font-bold ${getStatusColor(result.status)}`}>
                        {result.count}
                      </span>
                      <Badge variant={getStatusBadgeVariant(result.status)} className="text-xs">
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Normal: {result.normal_range}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Confidence</span>
                      <span className="text-xs font-medium">{result.confidence}%</span>
                    </div>
                    <Progress value={result.confidence} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {detectedAnomalies.length > 0 && (
        <Card className="shadow-card-medical border-warning/20">
          <CardHeader className="bg-warning/5">
            <CardTitle className="flex items-center space-x-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              <span>Detected Anomalies</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {detectedAnomalies.map((anomaly, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{anomaly}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {preliminaryDiagnosis.length > 0 && (
        <Card className="shadow-card-medical border-accent/20">
          <CardHeader className="bg-accent/5">
            <CardTitle className="flex items-center space-x-2 text-accent">
              <Eye className="h-5 w-5" />
              <span>Preliminary Clinical Findings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-accent font-medium mb-2">
                ⚠️ IMPORTANT CLINICAL NOTICE
              </p>
              <p className="text-xs text-muted-foreground">
                These AI-generated findings require validation by a qualified healthcare professional. 
                Do not use for direct patient diagnosis without clinical review.
              </p>
            </div>
            
            <ul className="space-y-2">
              {preliminaryDiagnosis.map((diagnosis, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{diagnosis}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-4">
        <Button variant="outline" className="flex-1">
          <Eye className="mr-2 h-4 w-4" />
          View Detailed Analysis
        </Button>
        <Button className="bg-gradient-medical hover:shadow-glow flex-1">
          <Download className="mr-2 h-4 w-4" />
          Generate Clinical Report
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;