import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PatientListRoutingModule } from './patient-routing.module';
import { PatientlistComponent } from './patientlist.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@NgModule({
    declarations: [PatientlistComponent],
    imports: [
        CommonModule,
        PatientListRoutingModule,
        MatButtonModule,
        MatInputModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatIconModule,
        MatPaginatorModule,
        SharedModule,
        MatSelectModule,
        MatDatepickerModule,
        MatRadioModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatCheckboxModule,
        MatTooltipModule,
        NgxMaskModule.forRoot(maskConfig),
        NgxSpinnerModule,
    ],
})
export class PatientListModule {}
