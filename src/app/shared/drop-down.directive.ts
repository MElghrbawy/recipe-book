import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropDown]'
})
export class DropDownDirective {
  @HostBinding('class.open') isOpen = false;
  constructor() { }
  @HostListener('click') toggleOpen(){
    this.isOpen = !this.isOpen;
  }

}
