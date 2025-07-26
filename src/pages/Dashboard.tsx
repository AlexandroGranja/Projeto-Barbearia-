import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone
} from "lucide-react"

const Dashboard = () => {
  const stats = [
    { title: "Agendamentos Hoje", value: "12", icon: Calendar, color: "primary" },
    { title: "Clientes Ativos", value: "89", icon: Users, color: "success" },
    { title: "Mensagens WhatsApp", value: "156", icon: MessageSquare, color: "accent" },
    { title: "Taxa de Conversão", value: "85%", icon: TrendingUp, color: "warning" },
  ]

  const recentAppointments = [
    { 
      id: 1, 
      client: "Maria Silva", 
      service: "Corte + Escova", 
      time: "10:00", 
      status: "confirmed",
      phone: "(11) 99999-9999"
    },
    { 
      id: 2, 
      client: "Ana Santos", 
      service: "Coloração", 
      time: "14:30", 
      status: "pending",
      phone: "(11) 88888-8888"
    },
    { 
      id: 3, 
      client: "Carla Lima", 
      service: "Manicure", 
      time: "16:00", 
      status: "confirmed",
      phone: "(11) 77777-7777"
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Confirmado</Badge>
      case "pending":
        return <Badge variant="outline" className="text-warning border-warning"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Cancelado</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard de Automação
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos e automações do WhatsApp
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 shadow-elegant">
          <MessageSquare className="w-4 h-4 mr-2" />
          Testar Automação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card shadow-elegant border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${
                stat.color === "primary" ? "bg-primary/10 text-primary" :
                stat.color === "success" ? "bg-success/10 text-success" :
                stat.color === "accent" ? "bg-accent/10 text-accent-foreground" :
                "bg-warning/10 text-warning"
              }`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Agendamentos de Hoje
            </CardTitle>
            <CardDescription>
              Próximos agendamentos confirmados via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{appointment.client}</p>
                      <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{appointment.time}</span>
                  {getStatusBadge(appointment.status)}
                  <Button variant="outline" size="sm">
                    <Phone className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Status da Automação
            </CardTitle>
            <CardDescription>
              Monitoramento em tempo real do N8N e APIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span>Evolution API</span>
                </div>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span>N8N Workflow</span>
                </div>
                <Badge className="bg-success text-success-foreground">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span>Google Sheets</span>
                </div>
                <Badge className="bg-warning text-warning-foreground">Lento</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span>PostgreSQL</span>
                </div>
                <Badge className="bg-success text-success-foreground">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard