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
    return (value * 100).toFixed(2) + '%';
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-PE');
  }
}
