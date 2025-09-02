import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HistorialAnalisisService, AnalisisHistorial } from '../../../application/services/historial-analisis.service';

@Component({
  selector: 'app-historial-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './historial-analisis.component.html',
  styleUrls: ['./historial-analisis.component.css']
})
export class HistorialAnalisisComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Estados del componente
  loading = false;
  error: string | null = null;
  
  // Datos del historial
  analisis: AnalisisHistorial[] = [];
  analisisFiltrados: AnalisisHistorial[] = [];
  
  // Filtros
  filtroTipo = '';
  filtroFecha = '';
  filtroTexto = '';
  
  // UI State
  menuActivo: string | null = null;
  analisisSeleccionado: AnalisisHistorial | null = null;

  constructor(private historialService: HistorialAnalisisService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarHistorial(): void {
    this.loading = true;
    this.error = null;

    this.historialService.obtenerHistorial()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analisis) => {
          this.analisis = analisis;
          this.analisisFiltrados = [...this.analisis];
          this.loading = false;
          console.log('Historial cargado:', analisis);
        },
        error: (err) => {
          console.error('Error al cargar historial:', err);
          this.error = err.message || 'Error al cargar el historial de análisis';
          this.loading = false;
          
          // Fallback a datos mock si hay error (para desarrollo)
          if (err.message.includes('Connection refused') || err.message.includes('404')) {
            console.warn('Backend no disponible, usando datos mock...');
            this.cargarDatosMockFallback();
          }
        }
      });
  }

  private cargarDatosMockFallback(): void {
    console.warn('Cargando datos mock como fallback...');
    setTimeout(() => {
      this.analisis = this.generarDatosMock();
      this.analisisFiltrados = [...this.analisis];
      this.loading = false;
      this.error = null;
    }, 500);
  }

  private generarDatosMock(): AnalisisHistorial[] {
    const fechaBase = new Date();
    return [
      {
        id: '1',
        tipo: 'TREA',
        fecha: new Date(fechaBase.getTime() - 24 * 60 * 60 * 1000),
        bono: 'Bono Corporativo ABC',
        bonoId: '1',
        parametros: {
          tasaEsperada: 8.5,
          valorNominal: 1000,
          tasa: 8.0,
          plazo: 5,
          frecuenciaPago: 2
        },
        resultados: {
          trea: 8.73,
          precioMaximo: 1050.25,
          tasaEsperada: 8.5
        },
        calculoBackend: {
          treaPorcentaje: 8.73,
          valorPresente: 1050.25,
          fechaCalculo: new Date(fechaBase.getTime() - 24 * 60 * 60 * 1000)
        },
        bonoNombre: 'Bono Corporativo ABC',
        inversorUsername: 'inversor1',
        tasaEsperada: 8.5,
        trea: 8.73,
        precioMaximo: 1050.25,
        fechaCalculo: new Date(fechaBase.getTime() - 24 * 60 * 60 * 1000),
        informacionAdicional: 'Cálculo TREA para inversión corporativa'
      },
      {
        id: '2',
        tipo: 'TREA',
        fecha: new Date(fechaBase.getTime() - 2 * 24 * 60 * 60 * 1000),
        bono: 'Bono Gubernamental XYZ',
        bonoId: '2',
        parametros: {
          tasaEsperada: 6.25,
          valorNominal: 5000,
          tasa: 6.0,
          plazo: 10,
          frecuenciaPago: 2
        },
        resultados: {
          trea: 6.45,
          precioMaximo: 4750.80,
          tasaEsperada: 6.25
        },
        calculoBackend: {
          treaPorcentaje: 6.45,
          valorPresente: 4750.80,
          fechaCalculo: new Date(fechaBase.getTime() - 2 * 24 * 60 * 60 * 1000)
        },
        bonoNombre: 'Bono Gubernamental XYZ',
        inversorUsername: 'inversor1',
        tasaEsperada: 6.25,
        trea: 6.45,
        precioMaximo: 4750.80,
        fechaCalculo: new Date(fechaBase.getTime() - 2 * 24 * 60 * 60 * 1000),
        informacionAdicional: 'Análisis de bono gubernamental'
      },
      {
        id: '3',
        tipo: 'TREA',
        fecha: new Date(fechaBase.getTime() - 3 * 24 * 60 * 60 * 1000),
        bono: 'Bono Municipal DEF',
        bonoId: '3',
        parametros: {
          tasaEsperada: 7.8,
          valorNominal: 2000,
          tasa: 7.5,
          plazo: 7,
          frecuenciaPago: 2
        },
        resultados: {
          trea: 7.95,
          precioMaximo: 1980.45,
          tasaEsperada: 7.8
        },
        calculoBackend: {
          treaPorcentaje: 7.95,
          valorPresente: 1980.45,
          fechaCalculo: new Date(fechaBase.getTime() - 3 * 24 * 60 * 60 * 1000)
        },
        bonoNombre: 'Bono Municipal DEF',
        inversorUsername: 'inversor1',
        tasaEsperada: 7.8,
        trea: 7.95,
        precioMaximo: 1980.45,
        fechaCalculo: new Date(fechaBase.getTime() - 3 * 24 * 60 * 60 * 1000),
        informacionAdicional: 'Evaluación municipal de medio plazo'
      },
      {
        id: '4',
        tipo: 'TREA',
        fecha: new Date(fechaBase.getTime() - 7 * 24 * 60 * 60 * 1000),
        bono: 'Bono Hipotecario GHI',
        bonoId: '4',
        parametros: {
          tasaEsperada: 9.2,
          valorNominal: 3000,
          tasa: 9.0,
          plazo: 15,
          frecuenciaPago: 4
        },
        resultados: {
          trea: 9.58,
          precioMaximo: 2850.67,
          tasaEsperada: 9.2
        },
        calculoBackend: {
          treaPorcentaje: 9.58,
          valorPresente: 2850.67,
          fechaCalculo: new Date(fechaBase.getTime() - 7 * 24 * 60 * 60 * 1000)
        },
        bonoNombre: 'Bono Hipotecario GHI',
        inversorUsername: 'inversor1',
        tasaEsperada: 9.2,
        trea: 9.58,
        precioMaximo: 2850.67,
        fechaCalculo: new Date(fechaBase.getTime() - 7 * 24 * 60 * 60 * 1000),
        informacionAdicional: 'Análisis de bono hipotecario largo plazo'
      },
      {
        id: '5',
        tipo: 'TREA',
        fecha: new Date(fechaBase.getTime() - 14 * 24 * 60 * 60 * 1000),
        bono: 'Bono Verde JKL',
        bonoId: '5',
        parametros: {
          tasaEsperada: 5.5,
          valorNominal: 1500,
          tasa: 5.25,
          plazo: 8,
          frecuenciaPago: 2
        },
        resultados: {
          trea: 5.78,
          precioMaximo: 1420.30,
          tasaEsperada: 5.5
        },
        calculoBackend: {
          treaPorcentaje: 5.78,
          valorPresente: 1420.30,
          fechaCalculo: new Date(fechaBase.getTime() - 14 * 24 * 60 * 60 * 1000)
        },
        bonoNombre: 'Bono Verde JKL',
        inversorUsername: 'inversor1',
        tasaEsperada: 5.5,
        trea: 5.78,
        precioMaximo: 1420.30,
        fechaCalculo: new Date(fechaBase.getTime() - 14 * 24 * 60 * 60 * 1000),
        informacionAdicional: 'Inversión sostenible y verde'
      }
    ];
  }

  aplicarFiltros(): void {
    this.analisisFiltrados = this.analisis.filter(analisis => {
      // Filtro por tipo
      if (this.filtroTipo && analisis.tipo !== this.filtroTipo) {
        return false;
      }

      // Filtro por fecha
      if (this.filtroFecha) {
        const ahora = new Date();
        const fechaAnalisis = new Date(analisis.fecha);
        
        switch (this.filtroFecha) {
          case 'hoy':
            if (fechaAnalisis.toDateString() !== ahora.toDateString()) {
              return false;
            }
            break;
          case 'semana':
            const semanaAtras = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (fechaAnalisis < semanaAtras) {
              return false;
            }
            break;
          case 'mes':
            const mesAtras = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (fechaAnalisis < mesAtras) {
              return false;
            }
            break;
          case 'trimestre':
            const trimestreAtras = new Date(ahora.getTime() - 90 * 24 * 60 * 60 * 1000);
            if (fechaAnalisis < trimestreAtras) {
              return false;
            }
            break;
        }
      }

      // Filtro por texto (bono)
      if (this.filtroTexto) {
        const texto = this.filtroTexto.toLowerCase();
        const bono = analisis.bono?.toLowerCase() || '';
        if (!bono.includes(texto)) {
          return false;
        }
      }

      return true;
    });
  }

  limpiarFiltros(): void {
    this.filtroTipo = '';
    this.filtroFecha = '';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  toggleMenu(analisisId: string): void {
    this.menuActivo = this.menuActivo === analisisId ? null : analisisId;
  }

  verDetalles(analisis: AnalisisHistorial): void {
    this.analisisSeleccionado = analisis;
    this.menuActivo = null;
  }

  cerrarModal(): void {
    this.analisisSeleccionado = null;
  }

  duplicarAnalisis(analisis: AnalisisHistorial): void {
    if (!analisis.id) {
      console.error('ID de análisis no válido');
      return;
    }

    this.historialService.duplicarAnalisis(analisis.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (nuevoAnalisis) => {
          console.log('Análisis duplicado:', nuevoAnalisis);
          alert(`Análisis "${this.getTituloAnalisis(analisis)}" duplicado exitosamente`);
          this.cargarHistorial(); // Recargar para mostrar el nuevo análisis
        },
        error: (err) => {
          console.error('Error al duplicar análisis:', err);
          alert('Error al duplicar el análisis. Intente nuevamente.');
        }
      });
    
    this.menuActivo = null;
  }

  eliminarAnalisis(analisisId: string): void {
    if (confirm('¿Está seguro de que desea eliminar este análisis?')) {
      this.historialService.eliminarAnalisis(analisisId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Análisis eliminado:', analisisId);
            alert('Análisis eliminado exitosamente');
            this.cargarHistorial(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al eliminar análisis:', err);
            alert('Error al eliminar el análisis. Intente nuevamente.');
          }
        });
    }
    this.menuActivo = null;
  }

  recalcular(analisis: AnalisisHistorial): void {
    console.log('Recalculando análisis:', analisis);
    // TODO: Implementar lógica de recálculo con el backend
    alert(`Recalculando "${this.getTituloAnalisis(analisis)}"...`);
  }

  exportarHistorial(): void {
    this.historialService.exportarHistorial('csv')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          // Crear URL del blob y descargar
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `historial-analisis-${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
          
          console.log('Historial exportado exitosamente');
        },
        error: (err) => {
          console.error('Error al exportar:', err);
          alert('Error al exportar el historial. Intente nuevamente.');
        }
      });
  }

  // Métodos de utilidad para el template
  getTituloAnalisis(analisis: AnalisisHistorial): string {
    return analisis.bono || `Análisis ${this.getTipoAnalisis(analisis.tipo)}`;
  }

  getTipoAnalisis(tipo: string): string {
    switch (tipo) {
      case 'TREA':
        return 'TREA Local';
      case 'FLUJO_CAJA':
        return 'Flujo de Caja';
      case 'CALCULO_BACKEND':
        return 'Cálculo Backend';
      default:
        return 'Análisis';
    }
  }

  getIconoTipo(tipo: string): string {
    switch (tipo) {
      case 'TREA':
        return '📈';
      case 'FLUJO_CAJA':
        return '💰';
      case 'CALCULO_BACKEND':
        return '🎯';
      default:
        return '📊';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

  trackByAnalisisId(index: number, analisis: AnalisisHistorial): string {
    return analisis.id;
  }
}
