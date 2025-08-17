import React, { useState } from "react";
import MedicalHeader from "@/components/MedicalHeader";
import ImageUploader from "@/components/ImageUploader";
import AnalysisResults from "@/components/AnalysisResults";
import ReportGenerator from "@/components/ReportGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  Clock,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const Index = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const { toast } = useToast();

  // Mock analysis function - in real implementation, this would call your YOLOv7 API
  const runAnalysis = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please upload at least one microscopy image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock results - replace with actual API call to your YOLOv7 model
    const mockResults = {
      imageName: uploadedImages[0].file.name,
      results: [
        {
          type: 'RBC' as const,
          count: 8,
          confidence: 94.5,
          normal_range: '0-2 per hpf',
          status: 'elevated' as const
        },
        {
          type: 'Cast' as const,
          count: 2,
          confidence: 91.2,
          normal_range: '0-1 per lpf',
          status: 'elevated' as const
        },
        {
          type: 'Urothelial' as const,
          count: 15,
          confidence: 88.7,
          normal_range: '0-5 per hpf',
          status: 'critical' as const
        }
      ],
      processingTime: 2.3,
      overallAccuracy: 91.5,
      detectedAnomalies: [
        'Elevated RBC count suggests possible urinary tract infection or kidney stones',
        'Increased urothelial cells may indicate inflammation or malignancy',
        'Multiple cell types elevated - recommend immediate clinical review'
      ],
      preliminaryDiagnosis: [
        'Possible urinary tract infection (UTI)',
        'Suspected hematuria - requires clinical correlation',
        'Recommend urology consultation for further evaluation'
      ]
    };

    setCurrentResults(mockResults);
    setAnalysisComplete(true);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete",
      description: `Processed ${uploadedImages.length} image(s) with 91.5% accuracy`,
    });
  };

  const resetAnalysis = () => {
    setAnalysisComplete(false);
    setCurrentResults(null);
    setUploadedImages([]);
  };

  // Mock report data
  const mockReportData = {
    patientId: "P2025-001234",
    sampleId: "US-" + Date.now().toString().slice(-6),
    analysisDate: new Date().toLocaleDateString(),
    processingTime: currentResults?.processingTime || 2.3,
    results: currentResults?.results || [],
    anomalies: currentResults?.detectedAnomalies || [],
    clinicalFindings: currentResults?.preliminaryDiagnosis || [],
    technician: "AI System v1.0"
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <MedicalHeader />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {!analysisComplete ? (
          <>
            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card-medical border-success/20">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-success">≥95%</div>
                  <div className="text-sm text-muted-foreground">Detection Accuracy</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card-medical border-accent/20">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent">≤10s</div>
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card-medical border-primary/20">
                <CardContent className="p-4 text-center">
                  <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">YOLOv7</div>
                  <div className="text-sm text-muted-foreground">AI Detection</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card-medical border-warning/20">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-warning">HPCSA</div>
                  <div className="text-sm text-muted-foreground">Compliant</div>
                </CardContent>
              </Card>
            </div>

            {/* Upload Section */}
            <Card className="shadow-medical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Urine Sediment Analysis</span>
                  <Badge variant="outline" className="ml-2">RBC Detection Focus</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ImageUploader onImagesUploaded={setUploadedImages} />
                
                {uploadedImages.length > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className="bg-gradient-medical hover:shadow-glow text-lg px-8 py-3 h-auto"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                          <span>Analyzing Images...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Play className="h-5 w-5" />
                          <span>Start AI Analysis</span>
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card-medical">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Real-time Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Get results in seconds with our optimized YOLOv7 architecture and attention mechanisms
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card-medical">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">High Accuracy</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI detection with ≥90% accuracy for RBCs, cast cells, and urothelial cells
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card-medical">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Clinical Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate standardized reports compatible with European and South African lab standards
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Analysis Results */}
            <AnalysisResults {...currentResults} />
            
            {/* Report Generation */}
            <ReportGenerator reportData={mockReportData} />
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetAnalysis}>
                <Brain className="mr-2 h-4 w-4" />
                Analyze More Images
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;