import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { KittingListComponent } from './kitting-list/kitting-list.component';

const adminRoutes: Route[] = [
  {
      path: 'list',
      component: KittingListComponent,
  },
  {path: '',
    component: KittingListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class KittingRoutingModule { }
