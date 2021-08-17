import { Component } from '@angular/core'
import { GKEditor } from 'ng-goku'

@Component({
    selector: 'app-root',
    template: `
    <gk-editor [(ngModel)]="editorData" [edit]="edit"></gk-editor>
    `,
})
export class AppComponent {
    editorData = '文本内容双向绑定'
    edit = new GKEditor({
        height: 300,
        placeholder: '请输入正文。。',
        ossServerUrl: '/admin/api/v1/fileUpload/token',
        ossPublic: true,
    })
    constructor() {
    }
}
