import { NgModule } from "@angular/core";
import { baseModules } form "./baseModules"

import { NzSwitchModule } from 'ng-zorro-antd/switch';

import {
    GKButtonModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...baseModules,
        NzSwitchModule,
        GKButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
