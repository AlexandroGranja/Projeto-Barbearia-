import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Camera, 
  Scissors, 
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
  Mic,
  FileText,
  Sparkles,
  Eye,
  Layers
} from "lucide-react"

const CutAnalysis = () => {
  const [analysisResults, setAnalysisResults] = useState([
    {
      id: 1,
      client: "Ana Santos",
      type: "image",
      input: "foto_cabelo_atual.jpg",
      analysis: {
        hairType: "Ondulado",
        faceShape: "Oval",
        currentLength: "Médio",
        recommendation: "Corte em camadas com franja lateral",
        confidence: 92
      },
      status: "completed"
    },
    {
      id: 2,
      client: "Maria Silva",
      type: "audio",
      input: "audio_descricao.mp3",
      analysis: {
        extractedText: "Quero um corte mais moderno, algo que rejuvenesça",
        sentiment: "Positivo",
        recommendation: "Corte bob assimétrico",
        confidence: 88
      },
      status: "processing"
    },
    {
      id: 3,
      client: "Carla Lima",
      type: "text",
      input: "Texto: Quero cortar bem curtinho, estilo pixie",
      analysis: {
        intent: "Corte radical",
        style: "Pixie cut",
        recommendation: "Pixie com nuances texturizadas",
        confidence: 95
      },
      status: "completed"
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Analisado</Badge>
      case "processing":
        return <Badge variant="outline" className="text-warning border-warning"><Sparkles className="w-3 h-3 mr-1" />Processando</Badge>
      default:
        return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Erro</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-primary" />
      case "audio":
        return <Mic className="w-4 h-4 text-accent-foreground" />
      case "text":
        return <FileText className="w-4 h-4 text-success" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Análise de Cortes IA
          </h1>
          <p className="text-muted-foreground">
            Processamento inteligente de imagens, áudio e texto para recomendações precisas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Teste
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Camera className="w-4 h-4 mr-2" />
            Simular Análise
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Análises Hoje
            </CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-success">+12% vs ontem</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Precisão Média
            </CardTitle>
            <Sparkles className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.7%</div>
            <p className="text-xs text-success">+2.1% esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Imagens Processadas
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Áudios Analisados
            </CardTitle>
            <Mic className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Análises Recentes
          </CardTitle>
          <CardDescription>
            Resultados das análises de IA em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisResults.map((result) => (
              <div key={result.id} className="p-4 bg-background/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(result.type)}
                    <div>
                      <p className="font-medium">{result.client}</p>
                      <p className="text-sm text-muted-foreground">{result.input}</p>
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>

                {result.status === "completed" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Análise Detectada:</h4>
                      <div className="space-y-1 text-sm">
                        {result.type === "image" && (
                          <>
                            <p><span className="text-muted-foreground">Tipo de cabelo:</span> {result.analysis.hairType}</p>
                            <p><span className="text-muted-foreground">Formato do rosto:</span> {result.analysis.faceShape}</p>
                            <p><span className="text-muted-foreground">Comprimento atual:</span> {result.analysis.currentLength}</p>
                          </>
                        )}
                        {result.type === "audio" && (
                          <>
                            <p><span className="text-muted-foreground">Texto extraído:</span> "{result.analysis.extractedText}"</p>
                            <p><span className="text-muted-foreground">Sentimento:</span> {result.analysis.sentiment}</p>
                          </>
                        )}
                        {result.type === "text" && (
                          <>
                            <p><span className="text-muted-foreground">Intenção:</span> {result.analysis.intent}</p>
                            <p><span className="text-muted-foreground">Estilo identificado:</span> {result.analysis.style}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recomendação IA:</h4>
                      <p className="text-sm bg-primary/5 p-2 rounded border-l-2 border-primary">
                        {result.analysis.recommendation}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Confiança:</span>
                        <Progress value={result.analysis.confidence} className="flex-1 h-2" />
                        <span className="text-xs font-medium">{result.analysis.confidence}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {result.status === "processing" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analisando com IA...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Models Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Análise de Imagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Modelo Vision AI</span>
              <Badge className="bg-success text-success-foreground">Ativo</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Precisão</span>
                <span>94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Velocidade</span>
                <span>1.2s</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mic className="h-5 w-5 text-accent-foreground" />
              Análise de Áudio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Whisper API</span>
              <Badge className="bg-success text-success-foreground">Ativo</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Precisão</span>
                <span>89.8%</span>
              </div>
              <Progress value={89.8} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Velocidade</span>
                <span>0.8s</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-success" />
              Análise de Texto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">GPT-4 Turbo</span>
              <Badge className="bg-success text-success-foreground">Ativo</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Precisão</span>
                <span>91.5%</span>
              </div>
              <Progress value={91.5} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Velocidade</span>
                <span>0.5s</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CutAnalysis