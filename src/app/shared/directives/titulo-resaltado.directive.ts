import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appTituloResaltado]',
  standalone: false,
})
export class TituloResaltadoDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.style.fontSize = '20px';
    this.el.nativeElement.style.fontWeight = 'bold';
  }
}
