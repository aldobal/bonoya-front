import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BonoService } from '../../../../bonos/application/services/bono.service';
import { Bono } from '../../../../bonos/domain/models/bono.model';
import { LoggerService } from '../../../../shared/services/logger.service';

@Component({
  selector: 'app-catalogo-bonos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './catalogo-bonos.component.html',
  styleUrl: './catalogo-bonos.component.css'
})
export class CatalogoBonosComponent implements OnInit {
  bonos: Bono[] = [];
  loading = false;
  error = '';
  
  // Estado de filtros colapsables
  filtrosVisibles = false;
  
  // Filtros
  filtroMoneda = '';
  tasaMinima?: number;
  tasaMaxima?: number;

  constructor(
    private bonoService: BonoService,
    private logger: LoggerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logger.logComponentInit('CatalogoBonosComponent', {});
    this.cargarCatalogoBonos();
  }

  cargarCatalogoBonos(): void {
    this.loading = true;
    this.error = '';
    
    this.logger.info('🔄 Cargando catálogo de bonos...', 'CatalogoBonosComponent');
    
    this.bonoService.getCatalogoBonos().subscribe({
      next: (bonos) => {
        this.bonos = bonos;
        this.loading = false;
        this.logger.info('✅ Catálogo de bonos cargado desde backend', 'CatalogoBonosComponent', {
          cantidad: bonos.length,
          bonos: bonos.map(b => ({ id: b.id, nombre: b.nombre, emisor: b.emisorNombre }))
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al cargar el catálogo de bonos';
        this.loading = false;
        this.logger.error('❌ Error al cargar catálogo de bonos', 'CatalogoBonosComponent', {
          error: this.error,
          status: error.status
        });
      }
    });
  }

  filtrarPorMoneda(): void {
    if (!this.filtroMoneda) {
      this.cargarCatalogoBonos();
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.logger.info('🔍 Filtrando bonos por moneda', 'CatalogoBonosComponent', { moneda: this.filtroMoneda });
    
    this.bonoService.getBonosPorMoneda(this.filtroMoneda).subscribe({
      next: (bonos) => {
        this.bonos = bonos;
        this.loading = false;
        this.logger.info('✅ Bonos filtrados por moneda', 'CatalogoBonosComponent', {
          moneda: this.filtroMoneda,
          cantidad: bonos.length
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al filtrar bonos por moneda';
        this.loading = false;
        this.logger.error('❌ Error al filtrar por moneda', 'CatalogoBonosComponent', {
          error: this.error,
          moneda: this.filtroMoneda
        });
      }
    });
  }

  filtrarPorTasa(): void {
    if (this.tasaMinima === undefined && this.tasaMaxima === undefined) {
      this.cargarCatalogoBonos();
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.logger.info('🔍 Filtrando bonos por tasa', 'CatalogoBonosComponent', {
      tasaMinima: this.tasaMinima,
      tasaMaxima: this.tasaMaxima
    });
    
    this.bonoService.getBonosPorTasa(this.tasaMinima, this.tasaMaxima).subscribe({
      next: (bonos) => {
        this.bonos = bonos;
        this.loading = false;
        this.logger.info('✅ Bonos filtrados por tasa', 'CatalogoBonosComponent', {
          tasaMinima: this.tasaMinima,
          tasaMaxima: this.tasaMaxima,
          cantidad: bonos.length
        });
      },
      error: (error) => {
        this.error = error.error?.message || 'Error al filtrar bonos por tasa';
        this.loading = false;
        this.logger.error('❌ Error al filtrar por tasa', 'CatalogoBonosComponent', {
          error: this.error,
          tasaMinima: this.tasaMinima,
          tasaMaxima: this.tasaMaxima
        });
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroMoneda = '';
    this.tasaMinima = undefined;
    this.tasaMaxima = undefined;
    this.cargarCatalogoBonos();
    this.logger.info('🧹 Filtros limpiados', 'CatalogoBonosComponent');
  }

  trackByBonoId(index: number, bono: Bono): number {
    return bono.id;
  }

  formatCurrency(amount: number, currency?: string): string {
    const symbol = this.getCurrencySymbol(currency);
    
    // Para números grandes, usar formato compacto
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return `${symbol} ${millions.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const thousands = amount / 1000;
      return `${symbol} ${thousands.toFixed(0)}K`;
    } else {
      return `${symbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  }

  private getCurrencySymbol(currency?: string): string {
    switch (currency) {
      case 'USD': return '$';
      case 'PEN': return 'S/';
      case 'EUR': return '€';
      default: return '$';
    }
  }

  formatMetodoAmortizacion(metodo: string): string {
    switch (metodo) {
      case 'AMERICANO': return 'Americano';
      case 'ALEMAN': return 'Alemán';
      case 'FRANCES': return 'Francés';
      default: return metodo;
    }
  }

  analizarBono(bono: Bono): void {
    // Navegar a la calculadora con el bono seleccionado
    this.router.navigate(['/inversor/mis-calculos'], { 
      queryParams: { bonoId: bono.id } 
    });
    this.logger.info('🧮 Navegando a análisis del bono', 'CatalogoBonosComponent', { bono: bono.nombre });
  }

  verDetalleBono(bono: Bono): void {
    // Navegar a la página de detalle del bono
    this.router.navigate(['/inversor/detalle-bono', bono.id]);
    this.logger.info('👁️ Navegando a detalle del bono', 'CatalogoBonosComponent', { bono: bono.nombre });
  }

  verFlujoCaja(bono: Bono): void {
    // Navegar directamente al flujo de caja del bono
    this.router.navigate(['/inversor/calcular-flujo', bono.id]);
    this.logger.info('📊 Navegando a flujo de caja del bono', 'CatalogoBonosComponent', { bono: bono.nombre });
  }

  calcularFlujo(bono: Bono): void {
    // Navegar a la calculadora para flujo específico
    this.router.navigate(['/inversor/mis-calculos'], { 
      queryParams: { bonoId: bono.id, action: 'flujo' } 
    });
    this.logger.info('💸 Navegando a cálculo de flujo', 'CatalogoBonosComponent', { bono: bono.nombre });
  }

  toggleFiltros(): void {
    this.filtrosVisibles = !this.filtrosVisibles;
    this.logger.info(`${this.filtrosVisibles ? '📂' : '📁'} Filtros ${this.filtrosVisibles ? 'desplegados' : 'colapsados'}`, 'CatalogoBonosComponent');
  }
}