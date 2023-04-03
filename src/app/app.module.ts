import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TermsOfServiceComponent } from './modules/auth/terms-of-service/terms-of-service.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { PopupWindowComponent } from './modules/common/popup-window/popup-window.component';
import { PatientaddComponent } from './modules/doctor/patient/patientadd/patientadd.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from './shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationPopupComponent } from './modules/common/confirmation-popup/confirmation-popup.component';
import { ChartsModule } from 'ng2-charts';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    useHash: true,
};

@NgModule({
    declarations: [
        AppComponent,
        TermsOfServiceComponent,
        PopupWindowComponent,
        ConfirmationPopupComponent,
    ],
    entryComponents: [PopupWindowComponent, ConfirmationPopupComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatStepperModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatToolbarModule,
        SharedModule,
        ChartsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        MatRadioModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatTooltipModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
