import { Component, OnInit } from '@angular/core'
import { NzIconService } from 'ng-zorro-antd/icon'
import { FlagFill } from '@ant-design/icons-angular/icons'

@Component({
    selector: 'app-root',
    template: `
    icon为flag-fill的button按钮：<gk-button icon="flag-fill">flag button</gk-button>
    <br />
    <br />
    默认按钮可以设置active状态：<gk-button icon="flag-fill" [active]="isActive" (click)="isActive = !isActive">{{isActive?'选中效果':'没选中效果'}}</gk-button>
    `,
})
export class AppComponent implements OnInit {
    constructor(
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.addIcon(FlagFill)
    }
    public isActive = false
    timer
    ngOnInit(): void {
        this.timer = setInterval(() => {
            this.isActive = !this.isActive
        }, 3 * 1000)
    }
}
