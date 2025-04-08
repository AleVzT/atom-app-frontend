import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';
import { ConfirmCreateDialogComponent } from '../../shared/confirm-create-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';

  private userService = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  onLogin(): void {
    if (!this.email) return;

    this.userService.login(this.email).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.dialog.open(ConfirmCreateDialogComponent).afterClosed().subscribe(result => {
          if (result) {
            this.register();
          }
        });
      }
    });
  }

  private register(): void {
    this.userService.register(this.email).subscribe(() => {
      this.router.navigate(['/tasks']);
    });
  }
}

