import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import {
    GKButtonModule,
    GKFormModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        GKButtonModule,
        GKFormModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
