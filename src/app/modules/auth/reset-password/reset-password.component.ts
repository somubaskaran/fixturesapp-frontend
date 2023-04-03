import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { passwordValidator } from '../sign-up/customValidator';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    responseData:successResponseData;
    set : string;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private router:ActivatedRoute,
        private route:Router,
        private encrypt:EncryptDecryptService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {

    const filter = this.router.snapshot.queryParamMap.get('code');
    this.set = this.router.snapshot.queryParamMap.get('set');
    //console.log(this.encrypt.decryptDataForResetPassword(filter));
        this.checkCodeExists(filter);
        // Create the form
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: ['', [Validators.required,passwordValidator()]],
                passwordConfirm: ['', [Validators.required,passwordValidator()]],
                uuid:[filter,[]]
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }

    checkCodeExists(filter){
        this._authService
        .checkCodeExists({key:filter})
        .subscribe(
            (response:any) => {
                // Set the alert
                
            },
            (error:any) => {
                this.responseData = this.encrypt.decryptData(error.error.data);
                console.log(this.responseData);
                // Set the alert
                this.showAlert = true;
                this.alert = {
                    type: 'error',
                    message: this.responseData.msg,
                };
                setTimeout(() => {
                    this.showAlert = false;
                    this.route.navigateByUrl('/sign-in');
                },5000);
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;
        console.log(this.resetPasswordForm.value);
        // Send the request to the server
        this._authService
            .resetPassword(this.resetPasswordForm.value)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response:any) => {
                    // Set the alert
                    this.responseData = this.encrypt.decryptData(response.data);
                    this.alert = {
                        type: 'success',
                        message: this.responseData.msg
                    };
                    setTimeout(() => {
                        this.route.navigateByUrl('/sign-in');
                        this.showAlert = false;
                    },1000);
                },
                (error:any) => {
                    this.responseData = this.encrypt.decryptData(error.error.data);
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: this.responseData.msg,
                    };
                    setTimeout(() => {
                        this.showAlert = false;
                    },5000);
                }
            );
    }
}
