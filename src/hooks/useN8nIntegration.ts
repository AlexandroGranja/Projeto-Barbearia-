import { useState, useCallback } from 'react';
import { getN8nService, AgendamentoData, N8nResponse } from '../services/n8nService';

interface UseN8nIntegrationReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  enviarAgendamento: (dados: AgendamentoData) => Promise<N8nResponse>;
  enviarCancelamento: (agendamentoId: string, motivo?: string) => Promise<N8nResponse>;
  enviarLembrete: (agendamentoId: string, tipo: 'dia_anterior' | 'hora_anterior') => Promise<N8nResponse>;
  clearError: () => void;
  clearSuccess: () => void;
}

/**
 * Hook personalizado para integração com n8n
 */
export function useN8nIntegration(): UseN8nIntegrationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  const enviarAgendamento = useCallback(async (dados: AgendamentoData): Promise<N8nResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const n8nService = getN8nService();
      const response = await n8nService.enviarAgendamento(dados);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enviarCancelamento = useCallback(async (agendamentoId: string, motivo?: string): Promise<N8nResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const n8nService = getN8nService();
      const response = await n8nService.enviarCancelamento(agendamentoId, motivo);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enviarLembrete = useCallback(async (agendamentoId: string, tipo: 'dia_anterior' | 'hora_anterior'): Promise<N8nResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const n8nService = getN8nService();
      const response = await n8nService.enviarLembrete(agendamentoId, tipo);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    success,
    enviarAgendamento,
    enviarCancelamento,
    enviarLembrete,
    clearError,
    clearSuccess
  };
}

export default useN8nIntegration;

