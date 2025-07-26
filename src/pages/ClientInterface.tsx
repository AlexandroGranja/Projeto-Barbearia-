import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Image,
  Mic,
  Calendar,
  User,
  Phone,
  Clock,
  Scissors,
  Sparkles
} from "lucide-react"

const ClientInterface = () => {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Olá! 👋 Sou a assistente virtual do Salão Bela Vista. Como posso ajudá-la hoje?",
      time: "10:00"
    },
    {
      id: 2,
      type: "user",
      content: "Oi! Gostaria de agendar um corte de cabelo",
      time: "10:01"
    },
    {
      id: 3,
      type: "bot",
      content: "Perfeito! 💇‍♀️ Para te ajudar melhor, você pode me enviar uma foto do seu cabelo atual ou me contar que tipo de corte você tem em mente?",
      time: "10:01"
    }
  ])

  const [selectedService, setSelectedService] = useState("")
  const [clientInfo, setClientInfo] = useState({
    name: "Maria Silva",
    phone: "(11) 99999-9999"
  })

  const services = [
    { name: "Corte Feminino", price: "R$ 45", duration: "45min", icon: Scissors },
    { name: "Corte + Escova", price: "R$ 65", duration: "1h 15min", icon: Sparkles },
    { name: "Coloração", price: "R$ 120", duration: "2h", icon: Sparkles },
    { name: "Manicure", price: "R$ 25", duration: "30min", icon: Sparkles },
  ]

  const availableSlots = [
    "09:00", "10:30", "14:00", "15:30", "16:30"
  ]

  const sendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: chatMessages.length + 1,
      type: "user" as const,
      content: message,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
    
    setChatMessages([...chatMessages, newMessage])
    setMessage("")
    
    // Simular resposta do bot
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        type: "bot" as const,
        content: "Entendi! Vou processar sua solicitação e te mostrar as opções disponíveis. 🤔",
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, botResponse])
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Interface do Cliente
          </h1>
          <p className="text-muted-foreground">
            Simulação da experiência do cliente no WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">WhatsApp Conectado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Simulation */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-elegant border-0">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Salão Bela Vista</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Online - Responde em poucos minutos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-70">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} className="bg-gradient-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card className="bg-gradient-card shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input value={clientInfo.name} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input value={clientInfo.phone} readOnly />
              </div>
              <Badge className="bg-success text-success-foreground">Cliente Cadastrado</Badge>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="bg-gradient-card shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                Serviços Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedService === service.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedService(service.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.duration}</p>
                    </div>
                    <span className="font-bold text-primary">{service.price}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Available Times */}
          <Card className="bg-gradient-card shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horários Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-2 hover:bg-primary hover:text-primary-foreground"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ClientInterface