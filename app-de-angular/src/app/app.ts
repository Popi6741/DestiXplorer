import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
 template: `
  <div class="main-content-container">
    <router-outlet></router-outlet>
  </div>
`,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e2a38 0%, #2c3e50 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
  
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #1e2a38 0%, #2c3e50 100%);
      min-height: 100vh;
      color: #ecf0f1;
    }
  `]
})
export class AppComponent {
  title = 'DestiXplorer';
  
}