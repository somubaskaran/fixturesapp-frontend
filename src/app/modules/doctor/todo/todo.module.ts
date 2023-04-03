import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoRoutingModule } from './todo-routing.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
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
    declarations: [TodoListComponent],
    imports: [
        CommonModule,
        TodoRoutingModule,
        MatButtonModule,
        MatInputModule,
        SharedModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
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
export class TodoModule {}
