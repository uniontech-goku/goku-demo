import { NgModule } from "@angular/core";
import { baseModules } from './baseModules'

import {
    GKIconModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...baseModules,
        GKIconModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
