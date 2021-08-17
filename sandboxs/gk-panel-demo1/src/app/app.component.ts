import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    template: `
    <gk-panel [title]="'内容块标题'">
        内容块内容
    </gk-panel>
    <br />
    `,
})
export class AppComponent {

    constructor(
    ) { }

}
