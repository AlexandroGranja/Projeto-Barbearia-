// Serviço de integração com n8n
export interface AgendamentoData {
  cliente: {
    nome: string;
    telefone: string;
    email?: string;
  };
  agendamento: {
    servico: string;
    data: string;
    horario: string;
    preco: string;
    duracao: string;
  };
  barbearia: {
    nome: string;
    endereco?: string;
  };
}

export interface N8nResponse {
  success: boolean;
  message: string;
  workflowId?: string;
  executionId?: string;
}

class N8nService {
  private webhookUrl: string;
  private authToken?: string;

  constructor(webhookUrl: string, authToken?: string) {
    this.webhookUrl = webhookUrl;
    this.authToken = authToken;
  }

  /**
   * Envia dados de agendamento para o webhook do n8n
   */
  async enviarAgendamento(dados: AgendamentoData): Promise<N8nResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Adiciona autenticação se fornecida
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          evento: 'novo_agendamento',
          timestamp: new Date().toISOString(),
          dados
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        message: 'Agendamento enviado com sucesso para n8n',
        workflowId: result.workflowId,
        executionId: result.executionId
      };

    } catch (error) {
      console.error('Erro ao enviar agendamento para n8n:', error);
      return {
        success: false,
        message: `Erro ao enviar agendamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Envia notificação de cancelamento para o n8n
   */
  async enviarCancelamento(agendamentoId: string, motivo?: string): Promise<N8nResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          evento: 'cancelamento_agendamento',
          timestamp: new Date().toISOString(),
          dados: {
            agendamentoId,
            motivo: motivo || 'Não informado'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        message: 'Cancelamento enviado com sucesso para n8n',
        workflowId: result.workflowId,
        executionId: result.executionId
      };

    } catch (error) {
      console.error('Erro ao enviar cancelamento para n8n:', error);
      return {
        success: false,
        message: `Erro ao enviar cancelamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Envia lembrete de agendamento para o n8n
   */
  async enviarLembrete(agendamentoId: string, tipoLembrete: 'dia_anterior' | 'hora_anterior'): Promise<N8nResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          evento: 'lembrete_agendamento',
          timestamp: new Date().toISOString(),
          dados: {
            agendamentoId,
            tipoLembrete
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        message: 'Lembrete enviado com sucesso para n8n',
        workflowId: result.workflowId,
        executionId: result.executionId
      };

    } catch (error) {
      console.error('Erro ao enviar lembrete para n8n:', error);
      return {
        success: false,
        message: `Erro ao enviar lembrete: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Atualiza a URL do webhook
   */
  setWebhookUrl(url: string): void {
    this.webhookUrl = url;
  }

  /**
   * Atualiza o token de autenticação
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }
}

// Instância singleton do serviço
let n8nServiceInstance: N8nService | null = null;

/**
 * Inicializa o serviço n8n com configurações
 */
export function initializeN8nService(webhookUrl: string, authToken?: string): N8nService {
  n8nServiceInstance = new N8nService(webhookUrl, authToken);
  return n8nServiceInstance;
}

/**
 * Retorna a instância do serviço n8n
 */
export function getN8nService(): N8nService {
  if (!n8nServiceInstance) {
    throw new Error('N8n service não foi inicializado. Chame initializeN8nService() primeiro.');
  }
  return n8nServiceInstance;
}

export default N8nService;

