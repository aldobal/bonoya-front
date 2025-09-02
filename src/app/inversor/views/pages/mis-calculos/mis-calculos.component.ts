import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../../../shared/services/logger.service';
import { CalculoService } from '../../../application/services/calculo.service';
import { BonoService } from '../../../../bonos/application/services/bono.service';
import { CalculoInversion, Bono } from '../../../../bonos/domain/models/bono.model';

@Component({
  selector: 'app-mis-calculos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-calculos.component.html',
  styleUrl: './mis-calculos.component.css'
})
export class MisCalculosComponent implements OnInit {
  // Estado del componente
  bonosDisponibles: Bono[] = [];
  bonoSeleccionado: Bono | null = null;
  resultado: CalculoInversion | null = null;
  analisisResultado: CalculoInversion | null = null;
  flujoFinanciero: any[] = [];
  metricas: any = null; // Métricas del inversionista
  loading = false;
  error: string | null = null;
  calculando = false;
  
  // Parámetros de cálculo
  precioCompra = 0;
  tasaEsperada = 0; // Nueva propiedad para la tasa esperada del inversionista
  fechaCompra = '';
  cantidad = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private calculoService: CalculoService,
    private bonoService: BonoService
  ) {}

  ngOnInit(): void {
    this.logger.logComponentInit('MisCalculosComponent', {});
    this.cargarBonos();
    
    // Verificar si hay parámetros de query para pre-seleccionar un bono
    this.route.queryParams.subscribe(params => {
      if (params['bonoId']) {
        this.preseleccionarBono(+params['bonoId'], params['action']);
      }
    });
  }

  cargarBonos(): void {
    this.loading = true;
    this.error = null;
    
    this.bonoService.getCatalogoBonos().subscribe({
      next: (bonos) => {
        this.bonosDisponibles = bonos;
        this.loading = false;
        this.logger.info('📋 Bonos disponibles cargados', 'MisCalculosComponent', { cantidad: bonos.length });
      },
      error: (error) => {
        console.error('Error al cargar bonos:', error);
        this.error = 'No se pudieron cargar los bonos disponibles. Por favor intenta de nuevo.';
        this.loading = false;
        this.logger.error('Error al cargar bonos', 'MisCalculosComponent', error);
      }
    });
  }

  seleccionarBono(bono: Bono): void {
    this.bonoSeleccionado = bono;
    this.resultado = null;
    this.analisisResultado = null;
    this.flujoFinanciero = [];
    this.precioCompra = bono.valorNominal;
    this.tasaEsperada = bono.tasaCupon; // Inicializar con la tasa cupón del bono como sugerencia
    this.fechaCompra = new Date().toISOString().split('T')[0];
    this.logger.info('📋 Bono seleccionado', 'MisCalculosComponent', { bono: bono.nombre });
  }

  cambiarBono(): void {
    this.bonoSeleccionado = null;
    this.resultado = null;
    this.analisisResultado = null;
    this.flujoFinanciero = [];
    this.precioCompra = 0;
    this.tasaEsperada = 0;
    this.fechaCompra = '';
    this.cantidad = 1;
  }

  calcularTREA(): void {
    if (!this.bonoSeleccionado || !this.precioCompra) return;

    this.calculando = true;
    
    // Usar el método específico para TREA enriquecido
    this.calculoService.calcularTREAEnriquecido(this.bonoSeleccionado.id!, this.precioCompra).subscribe({
      next: (resultado) => {
        // Log detallado de los datos recibidos del backend
        console.log('📊 Datos TREA enriquecida recibidos del backend:', resultado);
        
        this.resultado = resultado;
        this.calculando = false;
        
        this.logger.info('📊 TREA calculada exitosamente con métricas del backend', 'MisCalculosComponent', {
          bono: this.bonoSeleccionado!.nombre,
          precioCompra: this.precioCompra,
          trea: resultado.trea,
          tieneMetricasAvanzadas: {
            tir: !!resultado.tir,
            van: !!resultado.van,
            tcea: !!resultado.tcea,
            duracion: !!resultado.duracion
          }
        });
      },
      error: (error) => {
        console.error('Error al calcular TREA:', error);
        this.calculando = false;
        this.logger.error('Error al calcular TREA', 'MisCalculosComponent', error);
      }
    });
  }

  realizarAnalisis(): void {
    if (!this.bonoSeleccionado || !this.precioCompra || !this.tasaEsperada) return;

    this.calculando = true;
    
    // Convertir la tasa esperada a formato decimal si viene como porcentaje
    const tasaEsperadaDecimal = this.tasaEsperada > 1 ? 
      this.tasaEsperada / 100 : 
      this.tasaEsperada;
    
    console.log('🔍 Iniciando análisis completo:', {
      bonoId: this.bonoSeleccionado.id,
      precioCompra: this.precioCompra,
      tasaEsperadaInput: this.tasaEsperada,
      tasaEsperadaDecimal: tasaEsperadaDecimal,
      bono: this.bonoSeleccionado.nombre,
      cantidad: this.cantidad
    });
    
    console.log('🚨 ANÁLISIS COMPLETO - Parámetros enviados al backend:', {
      'Bono ID': this.bonoSeleccionado.id,
      'Tasa Esperada del Inversionista (%)': this.tasaEsperada,
      'Tasa Esperada (decimal para VAN)': tasaEsperadaDecimal,
      'Precio de Compra (inversión inicial)': this.precioCompra,
      'Valor Nominal del Bono': this.bonoSeleccionado.valorNominal,
      'Tasa Cupón del Bono': this.bonoSeleccionado.tasaCupon,
      'Cantidad de Bonos': this.cantidad
    });
    
    // Usar el método específico para análisis completo que calcula todas las métricas
    this.calculoService.calcularAnalisisCompleto(this.bonoSeleccionado.id!, tasaEsperadaDecimal, this.precioCompra).subscribe({
      next: (resultado) => {
        // Log detallado de los datos recibidos del backend
        console.log('📊 Datos completos recibidos del backend:', resultado);
        console.log('📊 Verificando campos específicos:', {
          trea: resultado.trea,
          tir: resultado.tir,
          van: resultado.van,
          tcea: resultado.tcea,
          duracion: resultado.duracion,
          duracionModificada: resultado.duracionModificada,
          convexidad: resultado.convexidad,
          valorPresenteCupones: resultado.valorPresenteCupones,
          precioJusto: resultado.precioJusto,
          yield: resultado.yield,
          sensibilidadPrecio: resultado.sensibilidadPrecio,
          gananciaCapital: resultado.gananciaCapital,
          ingresosCupones: resultado.ingresosCupones,
          rendimientoTotal: resultado.rendimientoTotal
        });
        
        // Enriquecer el resultado con cálculos adicionales de UI
        this.analisisResultado = this.enriquecerAnalisis(resultado);
        this.calculando = false;
        
        console.log('📊 Resultado final enriquecido:', this.analisisResultado);
        
        this.logger.info('📊 Análisis completo realizado exitosamente con todas las métricas', 'MisCalculosComponent', {
          bono: this.bonoSeleccionado!.nombre,
          precioCompra: this.precioCompra,
          tasaEsperada: this.tasaEsperada,
          datosBackend: resultado,
          metricas: {
            trea: resultado.trea,
            tir: resultado.tir,
            van: resultado.van,
            tcea: resultado.tcea,
            duracion: resultado.duracion,
            convexidad: resultado.convexidad,
            precioJusto: resultado.precioJusto,
            valorPresenteCupones: resultado.valorPresenteCupones
          }
        });
      },
      error: (error) => {
        console.error('❌ Error al realizar análisis:', error);
        this.calculando = false;
        this.logger.error('Error al realizar análisis', 'MisCalculosComponent', error);
      }
    });
  }

  calcularFlujoFinanciero(): void {
    if (!this.bonoSeleccionado || !this.precioCompra) {
      this.logger.info('⚠️ No se puede calcular flujo sin bono o precio de compra', 'MisCalculosComponent');
      return;
    }

    this.calculando = true;
    
    // Usar el nuevo endpoint del backend que calcula el flujo del inversionista
    this.calculoService.calcularFlujoInversionista(this.bonoSeleccionado.id!, this.precioCompra).subscribe({
      next: (response) => {
        // Transformar la respuesta del backend al formato esperado por el frontend
        this.flujoFinanciero = response.flujos.map((flujo: any) => ({
          periodo: flujo.periodo,
          fecha: flujo.fecha,
          cupon: flujo.cupon,
          principal: flujo.principal,
          flujoTotal: flujo.flujoTotal,
          flujoNeto: flujo.flujoNeto,
          saldo: flujo.saldo,
          descripcion: flujo.descripcion,
          esInversionInicial: flujo.esInversionInicial
        }));
        
        // Guardar las métricas para uso posterior
        this.metricas = {
          gananciaNeta: response.gananciaNeta,
          rendimientoTotal: response.rendimientoTotal,
          periodoRecuperacion: response.periodoRecuperacion,
          totalCupones: response.totalCupones,
          totalPrincipal: response.totalPrincipal
        };
        
        this.calculando = false;
        
        this.logger.info('📊 Flujo del inversionista calculado exitosamente', 'MisCalculosComponent', {
          bono: this.bonoSeleccionado!.nombre,
          precioCompra: this.precioCompra,
          periodos: this.flujoFinanciero.length,
          gananciaNeta: response.gananciaNeta,
          rendimiento: response.rendimientoTotal
        });
      },
      error: (error) => {
        console.error('Error al calcular flujo del inversionista:', error);
        this.calculando = false;
        this.logger.error('Error al calcular flujo del inversionista', 'MisCalculosComponent', error);
      }
    });
  }

  verDetalleBono(bono: Bono): void {
    // Navegar a la página de detalle del bono
    // Por ahora, vamos a usar la ruta de catálogo con un parámetro
    this.router.navigate(['/inversor/detalle-bono', bono.id]);
    this.logger.info('🔍 Navegando a detalle del bono', 'MisCalculosComponent', { bono: bono.nombre });
  }

  preseleccionarBono(bonoId: number, action?: string): void {
    // Buscar el bono en la lista cuando esté cargada
    if (this.bonosDisponibles.length > 0) {
      const bono = this.bonosDisponibles.find(b => b.id === bonoId);
      if (bono) {
        this.seleccionarBono(bono);
        
        // Si hay una acción específica, ejecutarla
        if (action === 'flujo') {
          setTimeout(() => this.calcularFlujoFinanciero(), 500);
        }
        
        this.logger.info('🎯 Bono preseleccionado desde catálogo', 'MisCalculosComponent', { 
          bono: bono.nombre, 
          action: action 
        });
      }
    } else {
      // Si los bonos no están cargados aún, esperar un poco
      setTimeout(() => this.preseleccionarBono(bonoId, action), 100);
    }
  }

  // Helper methods para el template
  trackByBonoId(index: number, bono: Bono): any {
    return bono.id;
  }

  formatCurrency(value: number, currency: string = 'USD'): string {
    if (currency === 'PEN') {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
      }).format(value);
    } else if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(value);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getTotalFlujo(): number {
    return this.flujoFinanciero.reduce((total, flujo) => total + (flujo.flujoTotal || 0), 0);
  }

  // Métodos auxiliares para el flujo del inversionista (usando datos del backend)
  getGananciaNeta(): number {
    return this.metricas?.gananciaNeta || 0;
  }

  getRendimientoTotal(): number {
    return this.metricas?.rendimientoTotal || 0;
  }

  getPeriodoRecuperacion(): number {
    return this.metricas?.periodoRecuperacion || 0;
  }

  getTotalCupones(): number {
    return this.metricas?.totalCupones || this.flujoFinanciero.reduce((total, flujo) => total + (flujo.cupon || 0), 0);
  }

  getTotalPrincipal(): number {
    return this.metricas?.totalPrincipal || this.flujoFinanciero.reduce((total, flujo) => total + (flujo.principal || 0), 0);
  }

  enriquecerAnalisis(resultado: CalculoInversion): CalculoInversion {
    if (!this.bonoSeleccionado) return resultado;

    const bono = this.bonoSeleccionado;
    const precioCompra = this.precioCompra;
    const cantidad = this.cantidad;

    // Solo cálculos básicos de UI, TODO LO DEMÁS DEBE VENIR DEL BACKEND
    const valorInversion = precioCompra * cantidad;
    const valorNominalTotal = bono.valorNominal * cantidad;

    // Fecha de vencimiento (cálculo básico de UI)
    const fechaEmision = new Date(bono.fechaEmision);
    const fechaVencimiento = new Date(fechaEmision);
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + bono.plazoAnios);

    // Tiempo hasta vencimiento desde hoy
    const hoy = new Date();
    const tiempoVencimiento = (fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    // USAR SOLO DATOS QUE VIENEN DEL BACKEND - NO CALCULAR NADA MÁS
    const resultadoEnriquecido: CalculoInversion = {
      ...resultado, // Tomar TODOS los datos del backend
      
      // Información básica del bono (solo metadatos)
      valorNominal: bono.valorNominal,
      tasaCupon: bono.tasaCupon,
      plazoAnios: bono.plazoAnios,
      frecuenciaPagos: bono.frecuenciaPagos,
      moneda: bono.moneda?.codigo || 'USD',
      fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
      tiempoVencimiento: Math.round(tiempoVencimiento * 10) / 10,

      // USAR VALORES DEL BACKEND DIRECTAMENTE - SIN FALLBACKS NI CÁLCULOS
      trea: resultado.trea,
      tir: resultado.tir,
      van: resultado.van,
      tcea: resultado.tcea,
      duracion: resultado.duracion,
      duracionModificada: resultado.duracionModificada,
      convexidad: resultado.convexidad,
      valorPresenteCupones: resultado.valorPresenteCupones,
      precioJusto: resultado.precioJusto,
      yield: resultado.yield,
      sensibilidadPrecio: resultado.sensibilidadPrecio,
      gananciaCapital: resultado.gananciaCapital,
      ingresosCupones: resultado.ingresosCupones,
      rendimientoTotal: resultado.rendimientoTotal,

      // Estructura de análisis completo usando SOLO datos del backend
      analisisCompleto: {
        resumenInversion: {
          valorInversion: Math.round(valorInversion * 100) / 100,
          // CORREGIDO: Valor final = cupones + principal (total recibido)
          valorFinalEsperado: Math.round(((resultado.ingresosCupones || 0) + valorNominalTotal) * 100) / 100,
          // CORREGIDO: Ganancia total = ganancia capital + ingresos cupones
          gananciaTotal: ((resultado.gananciaCapital || 0) + (resultado.ingresosCupones || 0)),
          rentabilidadTotal: resultado.rendimientoTotal || 0
        },
        indicadoresRiesgo: {
          duracion: resultado.duracion || 0,
          duracionModificada: resultado.duracionModificada || 0,
          convexidad: resultado.convexidad || 0,
          sensibilidadPrecio: resultado.sensibilidadPrecio || 0
        },
        metricas: {
          trea: resultado.trea,
          tcea: resultado.tcea || 0,
          yield: resultado.yield || resultado.tir || resultado.trea,
          precioMaximo: resultado.precioMaximo || precioCompra
        }
      }
    };

    // Log para verificar que TODOS los datos vienen del backend
    this.logger.info('✅ Análisis enriquecido usando ÚNICAMENTE datos del backend', 'MisCalculosComponent', {
      datosBackend: {
        trea: resultado.trea,
        tir: resultado.tir,
        van: resultado.van,
        tcea: resultado.tcea,
        duracion: resultado.duracion,
        duracionModificada: resultado.duracionModificada,
        convexidad: resultado.convexidad,
        valorPresenteCupones: resultado.valorPresenteCupones,
        precioJusto: resultado.precioJusto,
        yield: resultado.yield,
        sensibilidadPrecio: resultado.sensibilidadPrecio,
        gananciaCapital: resultado.gananciaCapital,
        ingresosCupones: resultado.ingresosCupones,
        rendimientoTotal: resultado.rendimientoTotal
      },
      completitud: {
        tieneMetricasCompletas: !!(resultado.tir && resultado.van && resultado.tcea && 
          resultado.duracion && resultado.convexidad && resultado.precioJusto),
        camposFaltantes: {
          tir: !resultado.tir,
          van: !resultado.van,
          tcea: !resultado.tcea,
          duracion: !resultado.duracion,
          convexidad: !resultado.convexidad,
          precioJusto: !resultado.precioJusto
        }
      }
    });

    return resultadoEnriquecido;
  }

  // =================================================================
  // MÉTODOS DE UTILIDAD PARA FORMATEO Y VISUALIZACIÓN
  // =================================================================

  formatPercentage(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  }

  formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  getRiskLevel(duracion: number): string {
    if (duracion < 2) return 'Bajo';
    if (duracion < 5) return 'Moderado';
    if (duracion < 8) return 'Alto';
    return 'Muy Alto';
  }

  getRendimientoLabel(trea: number): string {
    if (trea < 3) return 'Conservador';
    if (trea < 6) return 'Moderado';
    if (trea < 10) return 'Atractivo';
    return 'Muy Atractivo';
  }
}
