import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Calendar,
  User,
  Microscope,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface ReportData {
  patientId: string;
  sampleId: string;
  analysisDate: string;
  processingTime: number;
  results: Array<{
    type: string;
    count: number;
    confidence: number;
    status: 'normal' | 'elevated' | 'critical';
    reference: string;
  }>;
  anomalies: string[];
  clinicalFindings: string[];
  technician: string;
}

interface ReportGeneratorProps {
  reportData: ReportData;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportData }) => {
  const generateReport = (format: 'docx' | 'xml') => {
    // In a real implementation, this would generate and download the report
    console.log(`Generating ${format.toUpperCase()} report...`);
    
    // Mock download functionality
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/xml'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urine_analysis_report_${reportData.sampleId}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'elevated':
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

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

  return (
    <Card className="shadow-card-medical">
      <CardHeader className="bg-gradient-subtle">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Clinical Analysis Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Report Header */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Patient ID:</span>
              <span className="text-sm">{reportData.patientId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Microscope className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sample ID:</span>
              <span className="text-sm">{reportData.sampleId}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Analysis Date:</span>
              <span className="text-sm">{reportData.analysisDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Technician:</span>
              <span className="text-sm">{reportData.technician}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Analysis Results */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <Microscope className="mr-2 h-4 w-4" />
            Cellular Analysis Results
          </h3>
          
          <div className="space-y-3">
            {reportData.results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <span className="font-medium">{result.type} Cells</span>
                    <div className="text-xs text-muted-foreground">
                      Reference: {result.reference}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${getStatusColor(result.status)}`}>
                    {result.count}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {result.confidence}% confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Anomalies */}
        {reportData.anomalies.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4 flex items-center text-warning">
              <AlertCircle className="mr-2 h-4 w-4" />
              Detected Anomalies
            </h3>
            <ul className="space-y-2">
              {reportData.anomalies.map((anomaly, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{anomaly}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Clinical Findings */}
        {reportData.clinicalFindings.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4 flex items-center text-accent">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Clinical Findings
            </h3>
            <ul className="space-y-2">
              {reportData.clinicalFindings.map((finding, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Clinical Disclaimer */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h4 className="font-semibold text-accent mb-2 flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Clinical Validation Required
          </h4>
          <p className="text-sm text-muted-foreground">
            This automated analysis must be reviewed and validated by a qualified healthcare professional 
            before clinical decision-making. Results are generated using AI-assisted detection and 
            classification algorithms. Processing time: {reportData.processingTime.toFixed(1)} seconds.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button 
            onClick={() => generateReport('docx')}
            className="flex-1 bg-gradient-medical hover:shadow-glow"
          >
            <Download className="mr-2 h-4 w-4" />
            Download DOCX Report
          </Button>
          <Button 
            onClick={() => generateReport('xml')}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download XML Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;