import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    responseData:successResponseData;
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;
    successMessage:string = '';
    formSubmitted:boolean = false;
    errorMessage:string = '';

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private encrypt:EncryptDecryptService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
        console.log(this.forgotPasswordForm.controls);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;
        this.formSubmitted = true;

        // Forgot password
        this._authService
            .forgotPassword(this.forgotPasswordForm.get('email').value)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                   // this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (data:any) => {
                    this.responseData =  this.encrypt.decryptData(data.data);
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message:this.responseData.msg,
                        
                    };
                    this.successMessage = this.responseData.msg;
                    setTimeout(() => {
                        this.successMessage = '';
                        this.showAlert = false;
                    },5000)
                },
                (error:any) => {
                    this.responseData =  this.encrypt.decryptData(error.error.data);
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message:this.responseData.msg,
                    };
                    this.errorMessage = this.responseData.msg;
                    setTimeout(() => {
                        this.errorMessage = '';
                        this.showAlert = false;
                    },5000)
                }
            );
    }
    resendForgotLink(){
        this.sendResetLink();
    }
}
