import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import {
    GKIconModule,
} from 'ng-goku'

import { IconDemo1Component } from "./app.component";

@NgModule({
    declarations: [IconDemo1Component],
    imports: [
        BrowserModule,
        GKIconModule,
    ],
    providers: [],
    bootstrap: [IconDemo1Component]
})
export class AppModule { }
