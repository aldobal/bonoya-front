import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CalculoRepositoryPort } from '../../domain/ports/calculo.repository.port';
import { CalculoInversion, CreateCalculoDto } from '../../../bonos/domain/models/bono.model';

// Token de inyección para el repositorio de cálculos
export const CALCULO_REPOSITORY_TOKEN = 'CalculoRepositoryPort';

export interface CalculoTREA {
  trea: number;
  precioCompra: number;
  valorNominal: number;
  gananciaTotal: number;
  rentabilidadTotal: number;
}

export interface ResultadoCalculoEnriquecido {
  metrica: string;
  valor: number;
  valorPorcentaje?: number;
  informacionAdicional: string;
  resultados: {
    trea?: number;
    tcea?: number;
    duracion?: number;
    convexidad?: number;
    precioMaximo?: number;
    spread?: number;
    margenSeguridad?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CalculoService {
  constructor(
    @Inject(CALCULO_REPOSITORY_TOKEN) private calculoRepository: CalculoRepositoryPort
  ) {}

  // ==================== GESTIÓN DE CÁLCULOS ====================

  /**
   * Crear un nuevo cálculo de inversión
   */
  crearCalculo(calculo: CreateCalculoDto): Observable<CalculoInversion> {
    return this.calculoRepository.createCalculo(calculo);
  }

  /**
   * Alias para crearCalculo - mantiene consistencia con el componente
   */
  createCalculo(calculo: CreateCalculoDto): Observable<CalculoInversion> {
    return this.crearCalculo(calculo);
  }

  /**
   * Obtener todos mis cálculos
   */
  getMisCalculos(): Observable<CalculoInversion[]> {
    return this.calculoRepository.getMisCalculos();
  }

  /**
   * Obtener un cálculo específico por ID
   */
  getCalculoPorId(id: number): Observable<CalculoInversion> {
    return this.calculoRepository.getCalculo(id);
  }

  /**
   * Eliminar un cálculo
   */
  eliminarCalculo(id: number): Observable<void> {
    return this.calculoRepository.deleteCalculo(id);
  }

  // ==================== MÉTODOS ENRIQUECIDOS ====================

  /**
   * Calcular TREA enriquecido con análisis completo
   */
  calcularTREAEnriquecido(bonoId: number, precioCompra: number): Observable<CalculoInversion> {
    return this.calculoRepository.calcularTREAEnriquecido(bonoId, precioCompra);
  }

  /**
   * Calcular TCEA enriquecido del emisor
   */
  calcularTCEAEnriquecido(bonoId: number): Observable<CalculoInversion> {
    return this.calculoRepository.calcularTCEAEnriquecido(bonoId);
  }

  /**
   * Calcular duración enriquecida con análisis de sensibilidad
   */
  calcularDuracionEnriquecida(bonoId: number): Observable<CalculoInversion> {
    return this.calculoRepository.calcularDuracionEnriquecida(bonoId);
  }

  /**
   * Calcular convexidad enriquecida con análisis de riesgo
   */
  calcularConvexidadEnriquecida(bonoId: number): Observable<CalculoInversion> {
    return this.calculoRepository.calcularConvexidadEnriquecida(bonoId);
  }

  /**
   * Calcular precio máximo enriquecido
   */
  calcularPrecioMaximoEnriquecido(bonoId: number, tasaEsperada: number): Observable<CalculoInversion> {
    return this.calculoRepository.calcularPrecioMaximoEnriquecido(bonoId, tasaEsperada);
  }

  /**
   * Calcular análisis completo con todas las métricas
   */
  calcularAnalisisCompleto(bonoId: number, tasaEsperada: number, precioCompra?: number): Observable<CalculoInversion> {
    return this.calculoRepository.calcularAnalisisCompleto(bonoId, tasaEsperada, precioCompra);
  }

  /**
   * Calcular flujo específico del inversionista
   */
  calcularFlujoInversionista(bonoId: number, precioCompra: number): Observable<any> {
    return this.calculoRepository.calcularFlujoInversionista(bonoId, precioCompra);
  }

  // ==================== UTILIDADES ====================

  /**
   * Mapear resultado de cálculo enriquecido del backend
   */
  mapearResultadoEnriquecido(calculo: CalculoInversion): ResultadoCalculoEnriquecido {
    return {
      metrica: calculo.tipoAnalisis || 'ANALISIS',
      valor: calculo.trea || 0,
      valorPorcentaje: calculo.treaPorcentaje,
      informacionAdicional: calculo.informacionAdicional || '',
      resultados: {
        trea: calculo.trea,
        tcea: calculo.valorNominal && calculo.tasaCupon ? (calculo.tasaCupon / 100) : undefined,
        precioMaximo: calculo.precioMaximo,
        margenSeguridad: calculo.valorNominal && calculo.precioMaximo ? 
          calculo.valorNominal - calculo.precioMaximo : undefined
      }
    };
  }
}