import { Observable } from 'rxjs';
import { CalculoInversion, CreateCalculoDto } from '../../../bonos/domain/models/bono.model';

export interface CreateCalculoEnriquecidoDto {
  precioCompra: number;
  valorNominal: number;
  tasaCupon: number;
  plazoAnios: number;
  frecuenciaPagos: number;
}

// Puerto de salida para operaciones de cálculos del inversor
export interface CalculoRepositoryPort {
  getMisCalculos(): Observable<CalculoInversion[]>;
  createCalculo(calculo: CreateCalculoDto): Observable<CalculoInversion>;
  getCalculo(id: number): Observable<CalculoInversion>;
  deleteCalculo(id: number): Observable<void>;
  
  // Métodos enriquecidos para calculadora financiera
  calcularTREAEnriquecido(bonoId: number, precioCompra: number): Observable<CalculoInversion>;
  calcularTCEAEnriquecido(bonoId: number): Observable<CalculoInversion>;
  calcularDuracionEnriquecida(bonoId: number): Observable<CalculoInversion>;
  calcularConvexidadEnriquecida(bonoId: number): Observable<CalculoInversion>;
  calcularPrecioMaximoEnriquecido(bonoId: number, tasaEsperada: number): Observable<CalculoInversion>;
  calcularAnalisisCompleto(bonoId: number, tasaEsperada: number, precioCompra?: number): Observable<CalculoInversion>;
  
  // Nuevo método para cálculos independientes
  crearCalculoEnriquecidoIndependiente(params: CreateCalculoEnriquecidoDto): Observable<CalculoInversion>;
  
  // Método para flujo del inversionista
  calcularFlujoInversionista(bonoId: number, precioCompra: number): Observable<any>;
}