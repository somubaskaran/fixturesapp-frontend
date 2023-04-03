import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DoctorRoutingModule } from './doctor.routing.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        DoctorRoutingModule,
        ChartsModule,
        NgApexchartsModule,
        NgxMaskModule.forRoot(),
    ],
})
export class DoctorModule {}
