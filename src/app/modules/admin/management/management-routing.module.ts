import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ListComponent } from './list/list.component';

const managementRoutes: Route[] = [
  {
      path: 'list',
      component: ListComponent,
  },
  {path: '',
    component: ListComponent},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(managementRoutes)
  ]
})
export class ManagementRoutingModule { }
