import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientdetailComponent } from './patientdetail.component';
import { PatientDetailRoutingModule } from './patientdetail-routing.module';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxMaskModule, IConfig } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    PatientdetailComponent,
  ],
  imports: [
    CommonModule,
    PatientDetailRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    SharedModule,
    MatRadioModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot(maskConfig),
  ]
})
export class PatientdetailModule { }
