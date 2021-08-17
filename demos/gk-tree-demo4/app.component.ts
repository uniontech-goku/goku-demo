import { Component } from '@angular/core'
import { GKTree } from 'ng-goku'
import { NzIconService } from 'ng-zorro-antd/icon'
import { SmileOutline, FolderOutline } from '@ant-design/icons-angular/icons'

@Component({
    selector: 'app-root',
    template: `
    <gk-tree [gkTree]="gkTree"></gk-tree>
    `,
})
export class AppComponent {
    gkTree: GKTree = new GKTree([{
        name: 'parent 1',
        key: '100',
        arr: [
            {
                name: 'parent 1-0',
                key: '1001',
                disabled: true,
                arr: [
                    { name: 'leaf 1-0-0', key: '10010', disabled: true },
                    { name: 'leaf 1-0-1', key: '10011' },
                ],
            },
            {
                name: 'parent 1-1',
                key: '1002',
                arr: [
                    { name: 'leaf 1-1-0', key: '10020' },
                    { name: 'leaf 1-1-1', key: '10021' },
                ],
            },
        ],
    }], {
        expandAll: true,
        openIcon: 'smile',
        closeIcon: 'folder',
        replaceKeyName: {
            title: 'name',
            children: 'arr',
        },
    })
    constructor(
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.addIcon(SmileOutline, FolderOutline)
    }
}
