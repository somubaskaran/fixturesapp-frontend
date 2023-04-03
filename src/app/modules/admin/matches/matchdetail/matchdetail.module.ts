import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchdetailComponent } from './matchdetail.component';
import { MatchDetailRoutingModule } from './matchdetail-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MatTableModule } from '@angular/material/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatCardModule} from '@angular/material/card';
import {DragDropModule} from '@angular/cdk/drag-drop';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@NgModule({
    declarations: [MatchdetailComponent],
    imports: [
        CommonModule,
        MatchDetailRoutingModule,
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
        MatTableModule,
        NgxDatatableModule,
        MatTabsModule,
        ChartsModule,
        NgxMaskModule.forRoot(maskConfig),
        NgxSpinnerModule,
        NgApexchartsModule,
        MatCardModule,
        DragDropModule
    ],
})
export class MatchdetailModule {}
