import { NgModule } from "@angular/core";
import { baseModules } from './baseModules';

import {
    GKIconModule,
    GKButtonModule,
    GKSearchModule,
    GKFormModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...baseModules,

        GKIconModule,
        GKButtonModule,
        GKFormModule,
        GKSearchModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
