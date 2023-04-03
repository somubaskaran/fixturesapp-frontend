import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { ListComponent } from './list/list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { MatIconModule } from '@angular/material/icon';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [ListComponent],
    imports: [
        CommonModule,
        BillingRoutingModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        SharedModule,
        MatIconModule,
        NgxDatatableModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxSpinnerModule,
    ],
})
export class BillingModule {}
