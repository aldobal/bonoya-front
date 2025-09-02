import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BonoService } from '../../../../bonos/application/services/bono.service';
import { Bono, FlujoCaja } from '../../../../bonos/domain/models/bono.model';
import { LoggerService } from '../../../../shared/services/logger.service';

@Component({
  selector: 'app-flujo-caja-bono',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flujo-caja-bono.component.html',
  styleUrls: ['./flujo-caja-bono.component.css']
})
export class FlujoCajaBonoComponent implements OnInit {
  bono: Bono | null = null;
  flujoCaja: FlujoCaja[] = [];
  loading = false;
  loadingFlujo = false;
  error: string | null = null;
  bonoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bonoService: BonoService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.bonoId = +params['id'];
      this.cargarBono();
    });
  }

  cargarBono() {
    if (!this.bonoId) return;
    
    this.loading = true;
    this.error = null;
    
    this.bonoService.getMiBono(this.bonoId).subscribe({
      next: (bono: Bono) => {
        this.bono = bono;
        this.loading = false;
        this.cargarFlujoCaja();
      },
      error: (error: any) => {
        this.error = 'Error al cargar el bono';
        this.loading = false;
        this.logger.error('Error:', error);
      }
    });
  }

  cargarFlujoCaja() {
    if (!this.bonoId) return;
    
    this.loadingFlujo = true;
    
    this.bonoService.getFlujoBono(this.bonoId).subscribe({
      next: (flujo: FlujoCaja[]) => {
        this.flujoCaja = flujo;
        this.loadingFlujo = false;
      },
      error: (error: any) => {
        this.logger.error('Error al cargar flujo de caja:', error);
        this.loadingFlujo = false;
      }
    });
  }

  volverADetalle() {
    if (this.bonoId) {
      this.router.navigate(['/emisor/bonos', this.bonoId, 'detalle']);
    }
  }

  volverAMisBonos() {
    this.router.navigate(['/emisor/bonos']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-PE');
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

  getTotalCupones(): number {
    return this.flujoCaja.reduce((total, flujo) => total + flujo.cupon, 0);
  }

  getTotalAmortizacion(): number {
    return this.flujoCaja.reduce((total, flujo) => total + flujo.amortizacion, 0);
  }

  getTotalFlujo(): number {
    return this.flujoCaja.reduce((total, flujo) => total + flujo.flujoTotal, 0);
  }

  getMetodoAmortizacionTexto(): string {
    if (!this.bono) return '';
    
    switch (this.bono.metodoAmortizacion) {
      case 'AMERICANO':
        return 'Americano';
      case 'ALEMAN':
        return 'Alemán';
      case 'FRANCES':
        return 'Francés';
      default:
        return this.bono.metodoAmortizacion;
    }
  }
}
