import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'app/modules/doctor/dashboard/dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';


const doctorRoutes: Route[] = [
  {
      path: '',
      component: DashboardComponent,
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    RouterModule.forChild(doctorRoutes),
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgApexchartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    SharedModule,
    MatRadioModule,
    MatMomentDateModule,
    MatCheckboxModule,
    MatTooltipModule,
    NgxSpinnerModule,
  ]
})
export class DashboardModule { }
