import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ViewComponent } from './view/view.component';
@NgModule({
  declarations: [
    AccountComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    AccountRoutingModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    NgxDatatableModule,
    MatPaginatorModule,
    SharedModule,
    MatTooltipModule,
    MatSlideToggleModule,
    NgxSpinnerModule
  ]
})
export class AccountModule { }
