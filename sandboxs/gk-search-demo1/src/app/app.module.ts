import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import {
    GKSearchModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        GKSearchModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
