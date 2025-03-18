import { NgClass, NgFor, NgIf, NgStyle} from "@angular/common";
import { Provider } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgSelectModule } from '@ng-select/ng-select';


export const COMMON_DIRECTIVES: Provider[] = [NgIf, NgFor, NgClass, NgStyle];

export const FORM_MODULES: Provider[] = [FormsModule, ReactiveFormsModule, NgSelectModule]

export const ROUTER_MODULES: Provider[] = [RouterLinkActive, RouterLink];
