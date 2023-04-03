import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

const doctorRoutes: Route[] = [
    {
        path: 'dashboard',
        loadChildren: () =>
            import('app/modules/doctor/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
    },
    {
        path: 'patient-list',
        loadChildren: () =>
            import(
                'app/modules/doctor/patient/patientlist/patientlist.module'
            ).then((m) => m.PatientListModule),
    },
    {
        path: 'patient-add',
        loadChildren: () =>
            import(
                'app/modules/doctor/patient/patientadd/patientadd.module'
            ).then((m) => m.PatientaddModule),
    },
    {
        path: 'patient-detail',
        loadChildren: () =>
            import(
                'app/modules/doctor/patient/patientdetail/patientdetail.module'
            ).then((m) => m.PatientdetailModule),
    },
    {
        path: 'kitting',
        loadChildren: () =>
            import('app/modules/doctor/kitting/kitting.module').then(
                (m) => m.KittingModule
            ),
    },
    {
        path: 'todo',
        loadChildren: () =>
            import('app/modules/doctor/todo/todo.module').then(
                (m) => m.TodoModule
            ),
    },
    {
        path: 'userprofile',
        loadChildren: () =>
            import('app/modules/doctor/userprofile/userprofile.module').then(
                (m) => m.UserprofileModule
            ),
    },
    {
        path: 'alerts',
        loadChildren: () =>
            import('app/modules/doctor/alerts/alerts.module').then(
                (m) => m.AlertsModule
            ),
    },
    {
        path: 'billing',
        loadChildren: () =>
            import('app/modules/doctor/billing/billing.module').then(
                (m) => m.BillingModule
            ),
    },
    {
        path: 'reading',
        loadChildren: () =>
            import('app/modules/doctor/billing_new/billingnew.module').then(
                (m) => m.BillingnewModule
            ),
    },
    {
        path: 'records',
        loadChildren: () =>
            import('app/modules/doctor/records/records.module').then(
                (m) => m.RecordsModule
            ),
    },
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];

@NgModule({
    imports: [RouterModule.forChild(doctorRoutes)],
    exports: [RouterModule],
})
export class DoctorRoutingModule {}
