import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from '../../core/store/auth/auth.actions';
import { selectIsAuth, selectUser } from '../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: false,
})
export class NavbarComponent {
  isAuth$;
  user$;

  @Output() menuItemClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(private store: Store, private router: Router, private authService: AuthService) {
    this.isAuth$ = this.store.select(selectIsAuth);
    this.user$ = this.store.select(selectUser);
  }

  logout() {
    this.authService.logout();
    this.store.dispatch(AuthActions.clearAuthUser());
    this.router.navigate(['/login']);
  }

  onMenuItemClick() {
    this.menuItemClicked.emit();
  }
}
