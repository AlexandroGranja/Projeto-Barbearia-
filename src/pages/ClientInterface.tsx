import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useN8nIntegration } from "@/hooks/useN8nIntegration"
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
  Sparkles,
  Star,
  MapPin,
  CheckCircle2,
  Zap,
  Loader2
} from "lucide-react"

const ClientInterfaceModernPro = () => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()
  const { 
    isLoading: n8nLoading, 
    error: n8nError, 
    success: n8nSuccess, 
    enviarAgendamento,
    clearError,
    clearSuccess 
  } = useN8nIntegration()
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot" as const,
      content: "Olá! 👋 Bem-vinda ao **Salão Bela Vista**! Sou a Sofia, sua assistente virtual. Como posso tornar seu dia mais bonito hoje?",
      time: "10:00",
      avatar: "🤖"
    },
    {
      id: 2,
      type: "user" as const,
      content: "Oi Sofia! Gostaria de agendar um corte de cabelo para hoje",
      time: "10:01",
      avatar: "👩"
    },
    {
      id: 3,
      type: "bot" as const,
      content: "Perfeito! 💇‍♀️ Vou te ajudar a encontrar o horário ideal. Para personalizar melhor sua experiência, você poderia me enviar uma foto do seu cabelo atual? Assim posso sugerir os melhores serviços! ✨",
      time: "10:01",
      avatar: "🤖"
    }
  ])

  const [selectedService, setSelectedService] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const clientInfo = {
    name: "Maria Silva",
    phone: "(11) 99999-9999",
    visits: 12,
    rating: 5
  }

  const services = [
    {
      name: "Corte Feminino",
      description: "Corte personalizado com lavagem",
      duration: "45min",
      price: "R$ 45",
      popular: false
    },
    {
      name: "Corte + Escova",
      description: "Corte + escova modeladora",
      duration: "1h 15min",
      price: "R$ 65",
      popular: true
    },
    {
      name: "Coloração",
      description: "Coloração completa + hidratação",
      duration: "2h",
      price: "R$ 120",
      popular: false
    },
    {
      name: "Manicure",
      description: "Manicure tradicional",
      duration: "30min",
      price: "R$ 25",
      popular: false
    }
  ]

  const availableTimes = [
    { time: "09:00", occupied: false },
    { time: "10:30", occupied: true },
    { time: "14:00", occupied: false },
    { time: "15:30", occupied: false },
    { time: "16:30", occupied: true },
    { time: "17:00", occupied: false }
  ]

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: chatMessages.length + 1,
      type: "user" as const,
      content: message,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      avatar: "👩"
    }

    setChatMessages(prev => [...prev, newMessage])
    setMessage("")
    setIsTyping(true)

    // Simular resposta do bot
    setTimeout(() => {
      setIsTyping(false)
      const botResponse = {
        id: chatMessages.length + 2,
        type: "bot" as const,
        content: "Entendi! 😊 Vou verificar nossa agenda para você. Que tipo de serviço gostaria de fazer? Temos várias opções disponíveis no painel ao lado! 💜",
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        avatar: "🤖"
      }
      setChatMessages(prev => [...prev, botResponse])
    }, 2000)
  }

  const formatMessage = (content: string) => {
    return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  const confirmarAgendamento = async () => {
    if (!selectedService || !selectedTime) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um serviço e horário",
        variant: "destructive"
      })
      return
    }

    const servicoSelecionado = services.find(s => s.name === selectedService)
    if (!servicoSelecionado) return

    const dadosAgendamento = {
      cliente: {
        nome: clientInfo.name,
        telefone: clientInfo.phone
      },
      agendamento: {
        servico: selectedService,
        data: new Date().toISOString().split('T')[0],
        horario: selectedTime,
        preco: servicoSelecionado.price,
        duracao: servicoSelecionado.duration
      },
      barbearia: {
        nome: "Salão Bela Vista",
        endereco: "Rua das Flores, 123"
      }
    }

    try {
      const response = await enviarAgendamento(dadosAgendamento)
      
      if (response.success) {
        toast({
          title: "Agendamento Confirmado! ✅",
          description: "Seu agendamento foi enviado para processamento. Você receberá uma confirmação via WhatsApp em breve.",
        })

        const confirmationMessage = {
          id: chatMessages.length + 1,
          type: "bot" as const,
          content: `🎉 **Agendamento Confirmado!**\n\n✅ **${selectedService}**\n📅 Hoje, ${selectedTime}\n💰 ${servicoSelecionado.price}\n\nVocê receberá uma confirmação via WhatsApp em instantes. Obrigada por escolher o Salão Bela Vista! 💜`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          avatar: "🤖"
        }
        
        setChatMessages(prev => [...prev, confirmationMessage])
        setSelectedService("")
        setSelectedTime("")
        
      } else {
        toast({
          title: "Erro no Agendamento",
          description: response.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header Profissional */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Scissors className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Interface do Cliente
                </h1>
                <p className="text-gray-600">Experiência premium de agendamento via WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium text-sm">WhatsApp Conectado</span>
              <Zap className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat WhatsApp */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white/20">
                    <AvatarFallback className="bg-white/20 text-white font-bold text-lg">SB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl">Salão Bela Vista</CardTitle>
                    <CardDescription className="text-white/80 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Online • Responde em segundos
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-white font-medium">4.9</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
                <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8 shadow-md">
                          <AvatarFallback className={msg.type === "user" ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" : "bg-gradient-to-br from-purple-600 to-pink-600 text-white"}>
                            {msg.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-2xl px-4 py-3 shadow-lg ${
                          msg.type === "user" 
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
                            : "bg-white border border-gray-100"
                        }`}>
                          <div 
                            className={msg.type === "user" ? "text-white" : "text-gray-800"}
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                          />
                          <div className={`text-xs mt-2 ${msg.type === "user" ? "text-white/70" : "text-gray-500"}`}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">🤖</AvatarFallback>
                        </Avatar>
                        <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                  <div className="flex gap-3">
                    <Button variant="outline" size="icon" className="rounded-full border-gray-300 hover:bg-purple-50 hover:border-purple-300">
                      <Image className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-gray-300 hover:bg-purple-50 hover:border-purple-300">
                      <Mic className="w-4 h-4 text-gray-600" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="rounded-full border-gray-300 focus:border-purple-400 focus:ring-purple-400 pr-12"
                      />
                      <Button 
                        onClick={sendMessage}
                        size="icon"
                        className="absolute right-1 top-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Direita */}
          <div className="space-y-6">
            {/* Perfil do Cliente */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <CardTitle className="text-lg">Perfil do Cliente</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl font-bold">
                      {clientInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{clientInfo.name}</h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {clientInfo.phone}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {clientInfo.visits}
                    </div>
                    <div className="text-sm text-gray-600">Visitas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                      <Star className="w-6 h-6 fill-current" />
                      {clientInfo.rating}
                    </div>
                    <div className="text-sm text-gray-600">Avaliação</div>
                  </div>
                </div>
                
                <Badge className="w-full justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Cliente VIP
                </Badge>
              </CardContent>
            </Card>

            {/* Nossos Serviços */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Sparkles className="w-5 h-5" />
                  <CardTitle className="text-lg">Nossos Serviços</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.name}
                    onClick={() => setSelectedService(service.name)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedService === service.name
                        ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg transform scale-105"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                          <Scissors className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800">{service.name}</h4>
                            {service.popular && (
                              <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {service.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          R$
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          {service.price.replace('R$ ', '')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Horários Disponíveis */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <CardTitle className="text-lg">Horários Disponíveis</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  Hoje, 26 de Julho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {availableTimes.map((time) => (
                    <Button
                      key={time.time}
                      variant={selectedTime === time.time ? "default" : "outline"}
                      onClick={() => !time.occupied && setSelectedTime(time.time)}
                      disabled={time.occupied}
                      className={`h-12 transition-all duration-300 ${
                        selectedTime === time.time
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                          : time.occupied
                          ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                      }`}
                    >
                      {time.time}
                      {time.occupied && (
                        <span className="ml-2 text-xs">Ocupado</span>
                      )}
                    </Button>
                  ))}
                </div>
                
                {selectedService && selectedTime && (
                  <Button 
                    onClick={confirmarAgendamento}
                    disabled={n8nLoading}
                    className="w-full mt-6 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg font-semibold text-lg"
                  >
                    {n8nLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Confirmar Agendamento
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientInterfaceModernPro

