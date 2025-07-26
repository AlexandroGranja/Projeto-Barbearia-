// Serviço de integração com Evolution API
export interface EvolutionApiConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
}

export interface WhatsAppMessage {
  number: string;
  text: string;
}

export interface EvolutionApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface AgendamentoWhatsApp {
  cliente: {
    nome: string;
    telefone: string;
  };
  servico: string;
  data: string;
  horario: string;
  preco: string;
  local: string;
}

class EvolutionApiService {
  private config: EvolutionApiConfig;

  constructor(config: EvolutionApiConfig) {
    this.config = config;
  }

  /**
   * Formata número de telefone para o padrão internacional
   */
  private formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se não começar com 55 (código do Brasil), adiciona
    if (!cleanPhone.startsWith('55')) {
      return `55${cleanPhone}`;
    }
    
    return cleanPhone;
  }

  /**
   * Faz requisição para a Evolution API
   */
  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any): Promise<EvolutionApiResponse> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      
      const headers: Record<string, string> = {
        'apikey': this.config.apiKey,
        'Content-Type': 'application/json'
      };

      const requestOptions: RequestInit = {
        method,
        headers
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: `Erro HTTP ${response.status}`,
          error: data.message || 'Erro desconhecido'
        };
      }

      return {
        success: true,
        message: 'Requisição realizada com sucesso',
        data
      };

    } catch (error) {
      console.error('Erro na requisição para Evolution API:', error);
      return {
        success: false,
        message: 'Erro de conexão',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Verifica o status da instância
   */
  async getInstanceStatus(): Promise<EvolutionApiResponse> {
    return this.makeRequest(`/instance/connectionState/${this.config.instanceName}`);
  }

  /**
   * Envia mensagem de texto via WhatsApp
   */
  async sendTextMessage(message: WhatsAppMessage): Promise<EvolutionApiResponse> {
    const formattedNumber = this.formatPhoneNumber(message.number);
    
    const body = {
      number: formattedNumber,
      text: message.text
    };

    return this.makeRequest(`/message/sendText/${this.config.instanceName}`, 'POST', body);
  }

  /**
   * Envia confirmação de agendamento
   */
  async enviarConfirmacaoAgendamento(agendamento: AgendamentoWhatsApp): Promise<EvolutionApiResponse> {
    const mensagem = this.formatarMensagemConfirmacao(agendamento);
    
    return this.sendTextMessage({
      number: agendamento.cliente.telefone,
      text: mensagem
    });
  }

  /**
   * Envia lembrete de agendamento
   */
  async enviarLembreteAgendamento(agendamento: AgendamentoWhatsApp, tipo: 'dia_anterior' | 'hora_anterior'): Promise<EvolutionApiResponse> {
    const mensagem = this.formatarMensagemLembrete(agendamento, tipo);
    
    return this.sendTextMessage({
      number: agendamento.cliente.telefone,
      text: mensagem
    });
  }

  /**
   * Envia notificação de cancelamento
   */
  async enviarCancelamento(telefone: string, nomeCliente: string, servico: string, dataHora: string): Promise<EvolutionApiResponse> {
    const mensagem = `😔 *Agendamento Cancelado*\n\nOlá ${nomeCliente}!\n\nInfelizmente precisamos cancelar seu agendamento:\n\n❌ *Serviço:* ${servico}\n📅 *Data/Hora:* ${dataHora}\n\nPedimos desculpas pelo inconveniente. Entre em contato conosco para reagendar.\n\n📞 *Contato:* (11) 99999-9999\n\nSalão Bela Vista 💜`;
    
    return this.sendTextMessage({
      number: telefone,
      text: mensagem
    });
  }

  /**
   * Formata mensagem de confirmação de agendamento
   */
  private formatarMensagemConfirmacao(agendamento: AgendamentoWhatsApp): string {
    return `🎉 *Agendamento Confirmado!*\n\nOlá ${agendamento.cliente.nome}!\n\n✅ *Serviço:* ${agendamento.servico}\n📅 *Data:* ${agendamento.data}\n🕐 *Horário:* ${agendamento.horario}\n💰 *Valor:* ${agendamento.preco}\n\n📍 *Local:* ${agendamento.local}\n\nObrigada por escolher nossos serviços! Estamos ansiosas para recebê-la! 💜\n\n_Para cancelar ou reagendar, entre em contato conosco._`;
  }

  /**
   * Formata mensagem de lembrete
   */
  private formatarMensagemLembrete(agendamento: AgendamentoWhatsApp, tipo: 'dia_anterior' | 'hora_anterior'): string {
    if (tipo === 'dia_anterior') {
      return `🔔 *Lembrete de Agendamento*\n\nOlá ${agendamento.cliente.nome}!\n\nLembramos que você tem um agendamento amanhã:\n\n✂️ *Serviço:* ${agendamento.servico}\n📅 *Data:* ${agendamento.data}\n🕐 *Horário:* ${agendamento.horario}\n📍 *Local:* ${agendamento.local}\n\nNos vemos em breve! 😊💜`;
    } else {
      return `⏰ *Seu agendamento é em 1 hora!*\n\nOlá ${agendamento.cliente.nome}!\n\n✂️ ${agendamento.servico}\n🕐 ${agendamento.horario}\n📍 ${agendamento.local}\n\nEstamos te esperando! 💜\n\n_Caso precise cancelar, entre em contato urgentemente._`;
    }
  }

  /**
   * Configura webhook para receber mensagens
   */
  async configurarWebhook(webhookUrl: string): Promise<EvolutionApiResponse> {
    const body = {
      url: webhookUrl,
      enabled: true,
      events: [
        'MESSAGES_UPSERT',
        'MESSAGES_UPDATE',
        'CONNECTION_UPDATE'
      ]
    };

    return this.makeRequest(`/webhook/set/${this.config.instanceName}`, 'POST', body);
  }

  /**
   * Atualiza configuração da API
   */
  updateConfig(newConfig: Partial<EvolutionApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtém configuração atual
   */
  getConfig(): EvolutionApiConfig {
    return { ...this.config };
  }
}

// Instância singleton do serviço
let evolutionApiServiceInstance: EvolutionApiService | null = null;

/**
 * Inicializa o serviço Evolution API com configurações
 */
export function initializeEvolutionApiService(config: EvolutionApiConfig): EvolutionApiService {
  evolutionApiServiceInstance = new EvolutionApiService(config);
  return evolutionApiServiceInstance;
}

/**
 * Retorna a instância do serviço Evolution API
 */
export function getEvolutionApiService(): EvolutionApiService {
  if (!evolutionApiServiceInstance) {
    throw new Error('Evolution API service não foi inicializado. Chame initializeEvolutionApiService() primeiro.');
  }
  return evolutionApiServiceInstance;
}

export default EvolutionApiService;

