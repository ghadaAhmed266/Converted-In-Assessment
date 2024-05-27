import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector:'[appDropdown]'
})
export class DrodownDirective{
    @HostBinding('class.open') isopen=false;
    @HostListener('click') toggleOpen(){
        this.isopen=!this.isopen;
    }
}