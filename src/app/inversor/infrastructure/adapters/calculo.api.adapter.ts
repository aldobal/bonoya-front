import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CalculoRepositoryPort, CreateCalculoEnriquecidoDto } from '../../domain/ports/calculo.repository.port';
import { CalculoInversion, CreateCalculoDto } from '../../../bonos/domain/models/bono.model';

@Injectable({
  providedIn: 'root'
})
export class CalculoApiAdapter implements CalculoRepositoryPort {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/inversor`;

  constructor(private http: HttpClient) {}

  createCalculo(calculo: CreateCalculoDto): Observable<CalculoInversion> {
    return this.http.post<CalculoInversion>(`${this.apiUrl}/calculos`, calculo);
  }

  getCalculo(id: number): Observable<CalculoInversion> {
    return this.http.get<CalculoInversion>(`${this.apiUrl}/calculos/${id}`);
  }

  deleteCalculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/calculos/${id}`);
  }

  getMisCalculos(): Observable<CalculoInversion[]> {
    return this.http.get<CalculoInversion[]>(`${this.apiUrl}/calculos`);
  }

  calcularTREAEnriquecido(bonoId: number, precioCompra: number): Observable<CalculoInversion> {
    return this.http.post<any>(`${this.apiUrl}/calculos/trea-enriquecido`, {
      bonoId,
      precioCompra
    }).pipe(
      map(response => this.mapearRespuestaBackend(response))
    );
  }

  calcularTCEAEnriquecido(bonoId: number): Observable<CalculoInversion> {
    return this.http.post<any>(`${this.apiUrl}/calculos/tcea-enriquecido`, {
      bonoId
    }).pipe(
      map(response => this.mapearRespuestaBackend(response))
    );
  }

  calcularDuracionEnriquecida(bonoId: number): Observable<CalculoInversion> {
    return this.http.post<any>(`${this.apiUrl}/calculos/duracion-enriquecida`, {
      bonoId
    }).pipe(
      map(response => this.mapearRespuestaBackend(response))
    );
  }

  calcularConvexidadEnriquecida(bonoId: number): Observable<CalculoInversion> {
    return this.http.post<any>(`${this.apiUrl}/calculos/convexidad-enriquecida`, {
      bonoId
    }).pipe(
      map(response => this.mapearRespuestaBackend(response))
    );
  }

  calcularPrecioMaximoEnriquecido(bonoId: number, tasaEsperada: number): Observable<CalculoInversion> {
    return this.http.post<any>(`${this.apiUrl}/calculos/precio-maximo-enriquecido`, {
      bonoId,
      tasaEsperada
    }).pipe(
      map(response => this.mapearRespuestaBackend(response))
    );
  }

  calcularAnalisisCompleto(bonoId: number, tasaEsperada: number, precioCompra?: number): Observable<CalculoInversion> {
    const payload: any = {
      bonoId,
      tasaEsperada
    };
    
    // Agregar precio de compra si está disponible para el cálculo del VAN
    if (precioCompra !== undefined) {
      payload.precioCompra = precioCompra;
    }
    
    return this.http.post<any>(`${this.apiUrl}/calculos/analisis-completo`, payload).pipe(
      map(response => this.mapearRespuestaBackend(response))
    );
  }

  crearCalculoEnriquecidoIndependiente(params: CreateCalculoEnriquecidoDto): Observable<CalculoInversion> {
    return this.http.post<any>(`${this.apiUrl}/calculos/calculo-enriquecido-independiente`, params).pipe(
      map(response => this.mapearRespuestaBackend(response))
    );
  }

  calcularFlujoInversionista(bonoId: number, precioCompra: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bonos/${bonoId}/flujo-inversionista`, {
      precioCompra
    });
  }

  private mapearRespuestaBackend(response: any): CalculoInversion {
    const mapped: CalculoInversion = {
      id: response.id,
      bonoId: response.bonoId,
      bonoNombre: response.bonoNombre,
      inversorUsername: response.inversorUsername,
      tasaEsperada: response.tasaEsperada,
      trea: response.resultados?.trea || response.trea,
      precioMaximo: response.resultados?.precioMaximo || response.precioMaximo,
      fechaCalculo: response.fechaCalculo,
      informacionAdicional: response.informacionAdicional,
      
      tipoAnalisis: response.tipoAnalisis,
      valorNominal: response.parametros?.valorNominal,
      tasaCupon: response.parametros?.tasa,
      plazoAnios: response.parametros?.plazo,
      frecuenciaPagos: response.parametros?.frecuenciaPago,
      moneda: response.parametros?.moneda,
      treaPorcentaje: response.resultados?.treaPorcentaje,
      valorPresente: response.resultados?.valorPresente,
      
      tcea: response.resultados?.tcea,
      duracion: response.resultados?.duracion,
      duracionModificada: response.resultados?.duracionModificada,
      convexidad: response.resultados?.convexidad,
      van: response.resultados?.van,
      tir: response.resultados?.tir,
      valorPresenteCupones: response.resultados?.valorPresenteCupones,
      precioJusto: response.resultados?.precioJusto,
      yield: response.resultados?.yield,
      sensibilidadPrecio: response.resultados?.sensibilidadPrecio,
      gananciaCapital: response.resultados?.gananciaCapital,
      ingresosCupones: response.resultados?.ingresosCupones,
      rendimientoTotal: response.resultados?.rendimientoTotal,
      
      rentabilidadTotal: response.resultados?.rendimientoTotal,
      gananciaTotal: response.resultados?.gananciaCapital
    };
    
    console.log('Adaptador: Mapeando respuesta del backend:', {
      original: response,
      mapped: mapped
    });
    
    // Log específico para diagnosticar el problema del VAN
    console.log('🚨 DEBUG VAN - Datos específicos:', {
      'VAN del backend': response.resultados?.van,
      'VAN mapeado': mapped.van,
      'Tipo VAN backend': typeof response.resultados?.van,
      'Tipo VAN mapeado': typeof mapped.van,
      'TIR del backend': response.resultados?.tir,
      'Tasa esperada enviada': response.parametros?.tasaEsperada || 'No disponible',
      'Precio compra': response.parametros?.precioCompra || 'No disponible'
    });
    
    return mapped;
  }
}
