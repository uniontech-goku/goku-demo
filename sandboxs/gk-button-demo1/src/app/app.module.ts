import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { NzSwitchModule } from "ng-zorro-antd/switch";

import {
    GKButtonModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        NzSwitchModule,
        GKButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
