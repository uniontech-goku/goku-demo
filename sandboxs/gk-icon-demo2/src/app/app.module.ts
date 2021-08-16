import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import {
    GKIconModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        GKIconModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
