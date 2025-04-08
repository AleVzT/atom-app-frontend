import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeaderComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
