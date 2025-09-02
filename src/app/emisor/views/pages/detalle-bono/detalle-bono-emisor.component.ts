import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BonoService } from '../../../../bonos/application/services/bono.service';
import { Bono } from '../../../../bonos/domain/models/bono.model';
import { LoggerService } from '../../../../shared/services/logger.service';

@Component({
  selector: 'app-detalle-bono-emisor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-bono-emisor.component.html',
  styleUrl: './detalle-bono-emisor.component.css'
})
export class DetalleBonoEmisorComponent implements OnInit {
  // Properties
  bono: Bono | null = null;
  loading = true;
  error = '';
  bonoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bonoService: BonoService,
    private logger: LoggerService
  ) {}

  // Métodos de cálculo y análisis para el emisor
  calcularFechaVencimiento(): string {
    if (!this.bono?.fechaEmision || !this.bono?.plazoAnios) return 'N/A';
    
    const fechaEmision = new Date(this.bono.fechaEmision);
    const fechaVencimiento = new Date(fechaEmision);
    fechaVencimiento.setFullYear(fechaEmision.getFullYear() + this.bono.plazoAnios);
    
    return this.formatDate(fechaVencimiento);
  }

  calcularProximoPago(): string {
    if (!this.bono?.fechaEmision || !this.bono?.frecuenciaPagos) return 'N/A';
    
    const fechaEmision = new Date(this.bono.fechaEmision);
    const mesesEntrePagos = 12 / this.bono.frecuenciaPagos;
    const proximoPago = new Date(fechaEmision);
    proximoPago.setMonth(fechaEmision.getMonth() + mesesEntrePagos);
    
    // Encontrar el próximo pago desde hoy
    const hoy = new Date();
    while (proximoPago < hoy) {
      proximoPago.setMonth(proximoPago.getMonth() + mesesEntrePagos);
    }
    
    return this.formatDate(proximoPago);
  }

  getTasaRiesgo(): 'baja' | 'media' | 'alta' {
    if (!this.bono?.tasaCupon) return 'media';
    
    const tasa = this.bono.tasaCupon * 100;
    
    if (tasa < 5) return 'baja';
    if (tasa < 12) return 'media';
    return 'alta';
  }

  getMensajeTasa(): string {
    const riesgo = this.getTasaRiesgo();
    const tasa = this.bono?.tasaCupon ? (this.bono.tasaCupon * 100).toFixed(2) : '0';
    
    switch (riesgo) {
      case 'baja':
        return `Tasa competitiva del ${tasa}%. Excelente costo de financiamiento.`;
      case 'media':
        return `Tasa moderada del ${tasa}%. Costo de financiamiento razonable.`;
      case 'alta':
        return `Tasa elevada del ${tasa}%. Considera revisar las condiciones del mercado.`;
      default:
        return 'Tasa no disponible';
    }
  }

  calcularCostoAnual(): number {
    if (!this.bono?.valorNominal || !this.bono?.tasaCupon) return 0;
    return this.bono.valorNominal * this.bono.tasaCupon;
  }

  calcularTotalAPagar(): number {
    if (!this.bono?.valorNominal || !this.bono?.tasaCupon || !this.bono?.plazoAnios) return 0;
    
    const interesTotal = this.bono.valorNominal * this.bono.tasaCupon * this.bono.plazoAnios;
    const principal = this.bono.valorNominal;
    
    return interesTotal + principal;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bonoId = +params['id'];
      if (this.bonoId) {
        this.cargarDetalleBono();
      } else {
        this.error = 'ID de bono no válido';
        this.loading = false;
      }
    });
  }

  cargarDetalleBono(): void {
    if (!this.bonoId) return;
    
    this.loading = true;
    this.error = '';
    
    this.logger.info('🔍 [EMISOR] Cargando detalle del bono...', 'DetalleBonoEmisorComponent', { bonoId: this.bonoId });
    
    this.bonoService.getMiBono(this.bonoId).subscribe({
      next: (bono) => {
        this.bono = bono;
        this.loading = false;
        this.logger.info('✅ [EMISOR] Detalle del bono cargado exitosamente', 'DetalleBonoEmisorComponent', { bono });
      },
      error: (error: any) => {
        this.error = 'Error al cargar los detalles del bono';
        this.loading = false;
        this.logger.error('❌ [EMISOR] Error al cargar detalle del bono', 'DetalleBonoEmisorComponent', error);
      }
    });
  }

  verFlujoCaja(): void {
    if (this.bonoId) {
      this.logger.info('📊 [EMISOR] Navegando al flujo de caja', 'DetalleBonoEmisorComponent', { bonoId: this.bonoId });
      this.router.navigate(['/emisor/bonos', this.bonoId, 'flujo']);
    }
  }

  volverAMisBonos(): void {
    this.logger.info('🔙 [EMISOR] Navegando de vuelta a mis bonos', 'DetalleBonoEmisorComponent');
    this.router.navigate(['/emisor/bonos']);
  }

  editarBono(): void {
    if (this.bono) {
      this.logger.info('✏️ [EMISOR] Navegando a editar bono', 'DetalleBonoEmisorComponent', { bonoId: this.bono.id });
      this.router.navigate(['/emisor/bonos', this.bono.id, 'editar']);
    }
  }

  eliminarBono(): void {
    if (this.bono && confirm(`¿Estás seguro de que quieres eliminar el bono "${this.bono.nombre}"?`)) {
      this.logger.info('🗑️ [EMISOR] Eliminando bono', 'DetalleBonoEmisorComponent', { bonoId: this.bono.id });
      
      this.bonoService.deleteBono(this.bono.id!).subscribe({
        next: () => {
          this.logger.info('✅ [EMISOR] Bono eliminado exitosamente', 'DetalleBonoEmisorComponent');
          this.router.navigate(['/emisor/bonos']);
        },
        error: (error: any) => {
          this.logger.error('❌ [EMISOR] Error al eliminar bono', 'DetalleBonoEmisorComponent', error);
          alert('Error al eliminar el bono. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  // Métodos de formato
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatPercentage(value: number): string {
    // Si el valor es mayor a 1, probablemente ya está en formato porcentaje
    // Si es menor o igual a 1, probablemente está en formato decimal
    if (value > 1) {
      return value.toFixed(1) + '%';
    } else {
      return (value * 100).toFixed(1) + '%';
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-PE');
  }
}
