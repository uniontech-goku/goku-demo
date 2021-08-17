import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-root',
    template: `
    <h3 style="text-align: center;">401情况：</h3>
    <gk-alert [status]="'401'" style="display: flex; justify-content: center;"></gk-alert>
    <br/>
    <br/>
    <h3 style="text-align: center;">404情况：</h3>
    <gk-alert [status]="'404'" style="display: flex; justify-content: center;"></gk-alert>
    <br/>
    <br/>
    <h3 style="text-align: center;">500情况：</h3>
    <gk-alert [status]="'500'" [hideButton]="true" style="display: flex; justify-content: center;"></gk-alert>
    <br/>
    <br/>
    <h3 style="text-align: center;">refresh情况：</h3>
    <gk-alert [status]="'refresh'" [homeHref]="'/alert'" style="display: flex; justify-content: center;"></gk-alert>
    `,
})
export class AppComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
