import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { BonoService } from '../../../../bonos/application/services/bono.service';
import { Bono } from '../../../../bonos/domain/models/bono.model';
import { LoggerService } from '../../../../shared/services/logger.service';

@Component({
  selector: 'app-detalle-bono',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-bono.component.html',
  styleUrl: './detalle-bono.component.css'
})
export class DetalleBonoComponent implements OnInit {
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
    this.logger.logComponentInit('DetalleBonoComponent', {});
    const bonoId = this.route.snapshot.params['id'];
    if (bonoId) {
      this.bonoId = parseInt(bonoId);
      this.cargarDetalleBono();
    } else {
      this.error = 'ID de bono no válido';
      this.loading = false;
    }
  }

  cargarDetalleBono(): void {
    if (!this.bonoId) return;
    
    this.loading = true;
    this.error = '';
    
    this.logger.info('🔍 [INVERSOR] Cargando detalle del bono...', 'DetalleBonoComponent', { bonoId: this.bonoId });
    
    this.bonoService.getBonoDetalle(this.bonoId).subscribe({
      next: (bono) => {
        this.bono = bono;
        this.loading = false;
        this.logger.info('✅ [INVERSOR] Detalle del bono cargado exitosamente', 'DetalleBonoComponent', {
          bono: { id: bono.id, nombre: bono.nombre, emisorId: bono.emisorId }
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al cargar la información del bono';
        this.loading = false;
        this.logger.error('❌ [INVERSOR] Error al cargar detalle del bono', 'DetalleBonoComponent', {
          error: this.error,
          bonoId: this.bonoId,
          status: error.status
        });
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-PE');
  }

  volverAlCatalogo(): void {
    this.logger.info('⬅️ [INVERSOR] Volviendo al catálogo', 'DetalleBonoComponent');
    this.router.navigate(['/inversor/catalogo']);
  }
}
