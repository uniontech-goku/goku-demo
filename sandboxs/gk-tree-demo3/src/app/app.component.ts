import { Component } from '@angular/core'
import { GKTree } from 'ng-goku'


@Component({
    selector: 'app-root',
    template: `
    <nz-input-group [nzSuffix]="suffixIcon">
        <input type="text" nz-input placeholder="搜索" [(ngModel)]="searchValue" />
    </nz-input-group>
    <ng-template #suffixIcon>
        <i nz-icon nzType="search"></i>
    </ng-template>
    <gk-tree [gkTree]="gkTree" [searchValue]="searchValue"></gk-tree>
    `,
    styles: [
        `
        nz-input-group {
            margin-bottom: 12px;
        }
        `,
    ],
})
export class AppComponent {
    searchValue = ''
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
        checkbox: true,
        draggable: true,
        replaceKeyName: {
            title: 'name',
            children: 'arr',
        },
    })
    constructor() {
    }
}
