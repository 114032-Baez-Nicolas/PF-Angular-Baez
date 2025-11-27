import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [NavbarComponent, ToolbarComponent],
  imports: [CommonModule, SharedModule],
  exports: [NavbarComponent, ToolbarComponent],
})
export class LayoutModule {}
