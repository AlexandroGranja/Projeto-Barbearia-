import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Workflow, 
  MessageSquare, 
  Database, 
  Image,
  Mic,
  Calendar,
  CheckCircle,
  ArrowRight,
  Zap,
  FileText,
  Globe,
  Settings
} from "lucide-react"

const N8nGuide = () => {
  const workflowSteps = [
    {
      id: 1,
      title: "Webhook WhatsApp",
      description: "Recebe mensagens via Evolution API",
      node: "Webhook",
      color: "success",
      icon: MessageSquare,
      config: {
        method: "POST",
        path: "/webhook/whatsapp",
        responseMode: "responseNode"
      }
    },
    {
      id: 2,
      title: "Verificar Tipo",
      description: "Identifica se é texto, áudio ou imagem",
      node: "Switch",
      color: "warning",
      icon: Settings,
      config: {
        mode: "expression",
        conditions: [
          "{{ $json.message.type === 'text' }}",
          "{{ $json.message.type === 'audio' }}",
          "{{ $json.message.type === 'image' }}"
        ]
      }
    },
    {
      id: 3,
      title: "Processar Áudio",
      description: "Converte áudio em texto via Whisper",
      node: "HTTP Request",
      color: "accent",
      icon: Mic,
      config: {
        method: "POST",
        url: "https://api.openai.com/v1/audio/transcriptions",
        headers: {
          "Authorization": "Bearer {{ $env.OPENAI_API_KEY }}"
        }
      }
    },
    {
      id: 4,
      title: "Analisar Imagem",
      description: "IA analisa tipo de cabelo e formato do rosto",
      node: "HTTP Request",
      color: "primary",
      icon: Image,
      config: {
        method: "POST",
        url: "https://api.openai.com/v1/chat/completions",
        body: {
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "system",
              content: "Analise esta imagem de cabelo e identifique: tipo de cabelo, formato do rosto, comprimento atual, e sugira um corte adequado."
            }
          ]
        }
      }
    },
    {
      id: 5,
      title: "Buscar Cliente",
      description: "Consulta dados no PostgreSQL",
      node: "Postgres",
      color: "primary",
      icon: Database,
      config: {
        operation: "select",
        table: "clientes",
        where: {
          telefone: "{{ $json.from }}"
        }
      }
    },
    {
      id: 6,
      title: "Gerar Resposta IA",
      description: "GPT gera resposta personalizada",
      node: "OpenAI",
      color: "accent",
      icon: Zap,
      config: {
        model: "gpt-4-turbo",
        temperature: 0.7,
        systemPrompt: "Você é uma assistente virtual de um salão de beleza. Seja calorosa, profissional e ajude com agendamentos."
      }
    },
    {
      id: 7,
      title: "Verificar Agendamento",
      description: "Consulta disponibilidade no Google Sheets",
      node: "Google Sheets",
      color: "success",
      icon: Calendar,
      config: {
        operation: "read",
        sheetId: "{{ $env.GOOGLE_SHEET_ID }}",
        range: "Agendamentos!A:E"
      }
    },
    {
      id: 8,
      title: "Cache Redis",
      description: "Armazena conversa para contexto",
      node: "Redis",
      color: "warning",
      icon: Database,
      config: {
        operation: "set",
        key: "chat:{{ $json.from }}",
        value: "{{ $json.conversation }}",
        ttl: 3600
      }
    },
    {
      id: 9,
      title: "Enviar Resposta",
      description: "Retorna mensagem via Evolution API",
      node: "HTTP Request",
      color: "success",
      icon: MessageSquare,
      config: {
        method: "POST",
        url: "{{ $env.EVOLUTION_API_URL }}/message/sendText/{{ $env.INSTANCE_NAME }}",
        headers: {
          "apikey": "{{ $env.EVOLUTION_API_KEY }}"
        }
      }
    }
  ]

  const integrations = [
    {
      name: "Evolution API",
      description: "Gateway para WhatsApp Business API",
      status: "required",
      setup: "Configure instance, webhook URL e API key"
    },
    {
      name: "OpenAI API",
      description: "GPT-4 para texto e Whisper para áudio",
      status: "required", 
      setup: "API key do OpenAI com créditos suficientes"
    },
    {
      name: "Google Sheets API",
      description: "Planilha para agendamentos e dados",
      status: "required",
      setup: "Service Account e permissões na planilha"
    },
    {
      name: "PostgreSQL",
      description: "Banco principal para clientes e histórico",
      status: "required",
      setup: "Conectar via string de conexão"
    },
    {
      name: "Redis",
      description: "Cache para conversas e sessões",
      status: "optional",
      setup: "Para melhor performance e contexto"
    }
  ]

  const getStatusBadge = (status: string) => {
    return status === "required" 
      ? <Badge className="bg-destructive text-destructive-foreground">Obrigatório</Badge>
      : <Badge variant="outline">Opcional</Badge>
  }

  const getNodeColor = (color: string) => {
    switch (color) {
      case "success": return "text-success"
      case "warning": return "text-warning"
      case "accent": return "text-accent-foreground"
      case "primary": return "text-primary"
      default: return "text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Guia de Estrutura N8N
          </h1>
          <p className="text-muted-foreground">
            Como configurar a automação completa de agendamentos no N8N
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Globe className="w-4 h-4 mr-2" />
          Abrir N8N
        </Button>
      </div>

      {/* Overview */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Visão Geral do Workflow
          </CardTitle>
          <CardDescription>
            Fluxo completo de automação: WhatsApp → IA → Agendamento → Resposta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="px-2 py-1 bg-success/20 text-success rounded">WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-2 py-1 bg-warning/20 text-warning rounded">Análise IA</span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-2 py-1 bg-primary/20 text-primary rounded">Banco Dados</span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-2 py-1 bg-accent/20 text-accent-foreground rounded">Agendamento</span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-2 py-1 bg-success/20 text-success rounded">Resposta</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle>Nós do Workflow N8N</CardTitle>
          <CardDescription>
            Configuração passo a passo de cada nó no workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowSteps.map((step) => (
              <div key={step.id} className="p-4 bg-background/50 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${step.color}/10`}>
                    <step.icon className={`w-4 h-4 ${getNodeColor(step.color)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <Badge variant="outline" className="text-xs">{step.node}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                    
                    {/* Configuration Preview */}
                    <div className="bg-muted/30 p-2 rounded text-xs">
                      <div className="font-mono">
                        {step.node === "Webhook" && "POST /webhook/whatsapp"}
                        {step.node === "Switch" && "if (message.type === 'text')"}
                        {step.node === "HTTP Request" && `${step.config.method} ${step.config.url?.split('/').pop() || 'API'}`}
                        {step.node === "Postgres" && `SELECT * FROM ${step.config.table}`}
                        {step.node === "OpenAI" && `model: ${step.config.model}`}
                        {step.node === "Google Sheets" && `range: ${step.config.range}`}
                        {step.node === "Redis" && `SET ${step.config.key}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle>Integrações Necessárias</CardTitle>
          <CardDescription>
            APIs e serviços que precisam ser configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{integration.name}</h4>
                    {getStatusBadge(integration.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                  <p className="text-xs text-accent-foreground font-medium mt-1">{integration.setup}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Variáveis de Ambiente
          </CardTitle>
          <CardDescription>
            Configure estas variáveis no N8N
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/20 p-4 rounded-lg font-mono text-sm space-y-2">
            <div><span className="text-primary">EVOLUTION_API_URL</span>=https://sua-evolution-api.com</div>
            <div><span className="text-primary">EVOLUTION_API_KEY</span>=sua-api-key-evolution</div>
            <div><span className="text-primary">INSTANCE_NAME</span>=nome-da-instancia</div>
            <div><span className="text-primary">OPENAI_API_KEY</span>=sk-sua-chave-openai</div>
            <div><span className="text-primary">GOOGLE_SHEET_ID</span>=id-da-planilha-google</div>
            <div><span className="text-primary">POSTGRES_CONNECTION</span>=postgresql://user:pass@host:port/db</div>
            <div><span className="text-primary">REDIS_URL</span>=redis://host:port (opcional)</div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-glow border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>1. Configure as credenciais das APIs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>2. Importe o workflow JSON no N8N</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>3. Configure o webhook da Evolution API</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>4. Teste com mensagens de exemplo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>5. Monitore logs e ajuste conforme necessário</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default N8nGuide