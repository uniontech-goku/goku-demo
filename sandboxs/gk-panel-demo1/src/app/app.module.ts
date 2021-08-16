import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import {
    GKPanelModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,

        GKPanelModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
