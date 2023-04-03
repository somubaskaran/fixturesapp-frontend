import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';

import { NgxSpinnerModule } from 'ngx-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'app/shared/shared.module';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        NgxDatatableModule,
        NgApexchartsModule,
        NgxSpinnerModule,
        MatNativeDateModule,
        MatDatepickerModule,
        SharedModule,
        MatStepperModule,
        MatIconModule
    ],
})
export class AdminModule {}
