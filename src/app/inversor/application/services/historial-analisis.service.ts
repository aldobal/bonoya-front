import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface AnalisisHistorial {
  id: string;
  tipo: 'TREA' | 'FLUJO_CAJA' | 'CALCULO_BACKEND';
  fecha: Date;
  bono?: string;
  bonoId?: string;
  parametros: any;
  resultados: any;
  calculoBackend?: any;
  usuarioId?: string;
  
  // Campos adicionales del backend
  bonoNombre?: string;
  inversorUsername?: string;
  tasaEsperada?: number;
  trea?: number;
  precioMaximo?: number;
  fechaCalculo?: Date;
  informacionAdicional?: string;
}

export interface CreateAnalisisRequest {
  bonoId: number;
  tasaEsperada: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialAnalisisService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/inversor`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Obtiene todo el historial de análisis del usuario actual
   */
  obtenerHistorial(): Observable<AnalisisHistorial[]> {
    return this.http.get<any[]>(`${this.apiUrl}/calculos`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        // La respuesta es directamente un array de cálculos
        if (Array.isArray(response)) {
          return response.map((item: any) => this.mapearAnalisisFromBackend(item));
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Error al obtener historial:', error);
        return throwError(() => new Error('Error al cargar el historial de análisis'));
      })
    );
  }

  /**
   * Obtiene un análisis específico por ID
   */
  obtenerAnalisisPorId(id: string): Observable<AnalisisHistorial> {
    return this.http.get<any>(`${this.apiUrl}/calculos/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.mapearAnalisisFromBackend(response)),
      catchError(error => {
        console.error('Error al obtener análisis:', error);
        return throwError(() => new Error('Error al cargar el análisis'));
      })
    );
  }

  /**
   * Guarda un nuevo análisis en el historial
   */
  guardarAnalisis(analisis: CreateAnalisisRequest): Observable<AnalisisHistorial> {
    return this.http.post<any>(`${this.apiUrl}/calculos`, analisis, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.mapearAnalisisFromBackend(response)),
      catchError(error => {
        console.error('Error al guardar análisis:', error);
        return throwError(() => new Error('Error al guardar el análisis'));
      })
    );
  }

  /**
   * Actualiza un análisis existente - NO DISPONIBLE EN BACKEND
   */
  actualizarAnalisis(id: string, analisis: Partial<CreateAnalisisRequest>): Observable<AnalisisHistorial> {
    // Esta funcionalidad no está disponible en el backend actual
    return throwError(() => new Error('Actualización de análisis no disponible'));
  }

  /**
   * Elimina un análisis del historial
   */
  eliminarAnalisis(id: string): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/calculos/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error al eliminar análisis:', error);
        return throwError(() => new Error('Error al eliminar el análisis'));
      })
    );
  }

  /**
   * Obtiene análisis filtrados por tipo - NO DISPONIBLE EN BACKEND
   */
  obtenerAnalisisPorTipo(tipo: string): Observable<AnalisisHistorial[]> {
    // Esta funcionalidad no está disponible en el backend actual
    // Se puede implementar filtrado en el frontend
    return this.obtenerHistorial().pipe(
      map(analisis => analisis.filter(a => a.tipo === tipo))
    );
  }

  /**
   * Obtiene análisis de un bono específico - NO DISPONIBLE EN BACKEND
   */
  obtenerAnalisisPorBono(bonoId: string): Observable<AnalisisHistorial[]> {
    // Esta funcionalidad no está disponible en el backend actual
    // Se puede implementar filtrado en el frontend
    return this.obtenerHistorial().pipe(
      map(analisis => analisis.filter(a => a.bonoId === bonoId))
    );
  }

  /**
   * Duplica un análisis existente - NO DISPONIBLE EN BACKEND
   */
  duplicarAnalisis(id: string): Observable<AnalisisHistorial> {
    // Esta funcionalidad no está disponible en el backend actual
    // Se puede implementar obteniendo el análisis y creando uno nuevo
    return this.obtenerAnalisisPorId(id).pipe(
      switchMap((analisis: AnalisisHistorial) => {
        const nuevoAnalisis: CreateAnalisisRequest = {
          bonoId: parseInt(analisis.bonoId || '0'),
          tasaEsperada: analisis.tasaEsperada || 0
        };
        return this.guardarAnalisis(nuevoAnalisis);
      })
    );
  }

  /**
   * Exporta el historial a diferentes formatos - NO DISPONIBLE EN BACKEND
   */
  exportarHistorial(formato: 'csv' | 'excel' | 'pdf' = 'csv'): Observable<Blob> {
    // Esta funcionalidad no está disponible en el backend actual
    // Se puede implementar exportación en el frontend
    return this.obtenerHistorial().pipe(
      map(analisis => {
        const csvContent = this.convertirAnalisisACSV(analisis);
        return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      }),
      catchError(error => {
        console.error('Error al exportar historial:', error);
        return throwError(() => new Error('Error al exportar el historial'));
      })
    );
  }

  private convertirAnalisisACSV(analisis: AnalisisHistorial[]): string {
    const headers = ['ID', 'Tipo', 'Fecha', 'Bono', 'Tasa Esperada', 'TREA', 'Precio Máximo'];
    const rows = analisis.map(a => [
      a.id,
      a.tipo,
      a.fecha.toISOString().split('T')[0],
      a.bono || a.bonoNombre || '',
      a.tasaEsperada || '',
      a.trea || '',
      a.precioMaximo || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Mapea la respuesta del backend al formato esperado por el frontend
   */
  private mapearAnalisisFromBackend(item: any): AnalisisHistorial {
    return {
      id: item.id?.toString() || '',
      tipo: item.tipoAnalisis || 'TREA',
      fecha: new Date(item.fecha || item.fechaCalculo || new Date()),
      bono: item.bono || item.bonoNombre || '',
      bonoId: item.bonoId?.toString() || '',
      parametros: item.parametros || {
        tasaEsperada: item.tasaEsperada,
        valorNominal: item.valorNominal,
        tasa: item.tasaCupon,
        plazo: item.plazoAnios,
        frecuenciaPago: item.frecuenciaPagos,
        moneda: item.moneda
      },
      resultados: item.resultados || {
        trea: item.trea,
        precioMaximo: item.precioMaximo,
        tasaEsperada: item.tasaEsperada,
        treaPorcentaje: item.treaPorcentaje,
        valorPresente: item.valorPresente
      },
      calculoBackend: item.calculoBackend || {
        treaPorcentaje: item.treaPorcentaje || item.trea,
        valorPresente: item.valorPresente || item.precioMaximo,
        fechaCalculo: item.fechaCalculo
      },
      usuarioId: item.inversorUsername,
      
      // Campos adicionales del backend
      bonoNombre: item.bonoNombre,
      inversorUsername: item.inversorUsername,
      tasaEsperada: item.tasaEsperada,
      trea: item.trea,
      precioMaximo: item.precioMaximo,
      fechaCalculo: new Date(item.fechaCalculo || new Date()),
      informacionAdicional: item.informacionAdicional
    };
  }

  /**
   * Verifica si el servicio está disponible
   */
  verificarConexion(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/calculos`, {
      headers: this.getHeaders()
    }).pipe(
      map(() => true),
      catchError(() => throwError(() => new Error('Servicio no disponible')))
    );
  }
}
