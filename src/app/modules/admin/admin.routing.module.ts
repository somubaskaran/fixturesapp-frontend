import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';
// import { AccountComponent } from './account/account.component';
// import { KittingListComponent } from './kitting/kitting-list/kitting-list.component';
// import { ListComponent } from './billing/list/list.component';

const adminRoutes: Route[] = [
  {
      path: 'dashboard',
      component: DashboardComponent,
  },
  // {
  //   path: 'organization',
  //   loadChildren: () => import('app/modules/admin/account/account.module').then(m => m.AccountModule),
  // },
  // {
  //   path: 'patient',
  //   loadChildren: () => import('app/modules/admin/patient/patient.module').then(m => m.PatientModule),
  // },
  // {
  //   path: 'patient-detail',
  //   loadChildren: () =>
  //       import(
  //           'app/modules/admin/patient/patientdetail/patientdetail.module'
  //       ).then((m) => m.PatientdetailModule),
  // },
  // {
  //   path: 'kitting',
  //   loadChildren: () => import('app/modules/admin/kitting/kitting.module').then(m => m.KittingModule),
  // },
  // {
  //   path: 'billing',
  //   loadChildren: () => import('app/modules/admin/billing/billing.module').then(m => m.BillingModule),
  // },
  // {
  //   path: 'management',
  //   loadChildren: () => import('app/modules/admin/management/management.module').then(m => m.ManagementModule),
  // },
  // {
  //   path: 'records',
  //   loadChildren: () => import('app/modules/admin/records/records.module').then(m => m.RecordsModule),
  // },
  {
    path: 'matches',
    loadChildren: () => import('app/modules/admin/matches/matches.module').then(m => m.MatchesModule),
  },
  {path: '', pathMatch : 'full', redirectTo: 'dashboard'},
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
