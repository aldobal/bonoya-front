import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editar-bono',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Editar Bono</h1>
      <p>Formulario de edición - En construcción</p>
      <a routerLink="/emisor/bonos">Volver a Mis Bonos</a>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
  `]
})
export class EditarBonoComponent {} 