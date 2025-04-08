import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-create-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-wrapper">
      <h2 mat-dialog-title class="dialog-title">Usuario no encontrado</h2>

      <mat-dialog-content class="dialog-content">
        ¿Deseas crear uno nuevo?
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
        <button mat-flat-button color="primary" (click)="dialogRef.close(true)">
          Crear
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper {
      font-family: 'Segoe UI', sans-serif;
      padding: 0.5rem;
    }

    .dialog-title {
      font-size: 1.4rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .dialog-content {
      font-size: 1rem;
      color: #444;
      margin-bottom: 1rem;
    }

    .dialog-actions {
      padding-top: 0.5rem;
    }

    button[mat-button] {
      font-weight: 500;
    }

    button[mat-flat-button] {
      font-weight: 600;
    }
  `]
})
export class ConfirmCreateDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmCreateDialogComponent>) {}
}
