import { NgModule } from "@angular/core";
import { baseModules } form "./baseModules"

import {
    GKButtonModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...baseModules,
        GKButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
