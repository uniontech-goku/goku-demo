import { Component } from '@angular/core'
import { NzIconService } from 'ng-zorro-antd/icon'
import { FlagOutline, FlagFill, FlagTwoTone } from '@ant-design/icons-angular/icons'

@Component({
    selector: 'app-icon-demo1',
    template: `
    <div>
        <gk-icon style="font-size: 20px" type="flag"></gk-icon>
        <span style="margin-left: 20px">当type值为flag时，NZ的theme默认为outline</span>
    </div>
    <div>
        <gk-icon style="font-size: 20px" type="flag-outline"></gk-icon>
        <span style="margin-left: 20px">当type值为flag-outlien时，NZ的theme为outline。与上例效果相同。</span>
    </div>
    <div>
        <gk-icon style="font-size: 20px" type="flag-fill"></gk-icon>
        <span style="margin-left: 20px">当type值为flag-fill时，NZ的theme为fill。</span>
    </div>
    <div>
        <gk-icon style="font-size: 20px" type="flag-twotone"></gk-icon>
        <span style="margin-left: 20px">当type值为flag-twotone时，NZ的theme为twotone。</span>
    </div>
    `,
})
export class IconDemo1Component {
    constructor(
        private nzIcon: NzIconService,
    ) {
        this.nzIcon.addIcon(FlagOutline, FlagFill, FlagTwoTone)
    }

}
