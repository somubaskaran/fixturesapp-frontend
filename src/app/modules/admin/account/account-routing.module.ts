import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AccountComponent } from './account.component';
import { ViewComponent } from './view/view.component';

const adminRoutes: Route[] = [
  {
      path: 'list',
      component: AccountComponent,
  },
  {
      path: 'view',
      component: ViewComponent,
  },
  {path: '', pathMatch : 'full', redirectTo: 'list'},
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
