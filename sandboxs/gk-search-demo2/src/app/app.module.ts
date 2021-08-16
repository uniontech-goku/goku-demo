import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import {
    GKButtonModule,
    GKSearchModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        GKButtonModule,
        GKSearchModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
