import { NgModule } from "@angular/core";
import { baseModules } "./baseModules"

import {
    GKFormModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...baseModules,
        GKFormModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
