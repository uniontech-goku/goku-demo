import { NgModule } from "@angular/core";
import { baseModules } from './baseModules';

import {
    GKIconModule,
    GKButtonModule,
    GKSearchModule,
    GKFormModule,
    GKIOModule,
    GKEditorModule,
    GKTipModule,
    GKTitleModule,
    GKPanelModule,
} from 'ng-goku'

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [AppComponent],
    imports: [
        ...baseModules,

        GKIconModule,
        GKButtonModule,
        GKFormModule,
        GKSearchModule,
        GKIOModule,
        GKEditorModule,
        GKTipModule,
        GKTitleModule,
        GKPanelModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
