import { NgModule } from "@angular/core";
import { baseModules } form "./baseModules"

import {
    GKSearchModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...baseModules,
        GKSearchModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
