import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { errorResponseData, successResponseData } from 'app/core/response-schema';
import { environment } from 'environments/environment';

import { RecaptchaErrorParameters } from "ng-recaptcha";
import { TermsOfServiceComponent } from '../terms-of-service/terms-of-service.component';
import { mobileNumberValidator, passwordValidator } from './customValidator';


@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    agree:boolean = false;
    signUpForm: FormGroup;
    showAlert: boolean = false;

    errorResponse:errorResponseData;
    successResponse:successResponseData;
    emailErrorMessage:string = '';
    mobileErrorMessage:string = '';
    recaptchaKey:string;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private encrypt:EncryptDecryptService,
        private _cdr: ChangeDetectorRef,
        private elements:MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.recaptchaKey = environment.RECAPTCHA_KEY;
        console.log(this.recaptchaKey);
        // Create the form
        this.signUpForm = this._formBuilder.group({
                name      : ['', Validators.required],
                email_address : ['', [Validators.required, Validators.email]],
                password  : ['', [Validators.required,passwordValidator()]],
                country_code :['',[Validators.required]],
                mobile_number   : [null,[Validators.required,mobileNumberValidator()]],
                account_number:['',Validators.required],
                recaptcha:['1']
            }
        );
        
        console.log(this.signUpForm.pristine);
    }

    // -----------------------------------------------------------------------------------------------------
    
    /* static passwordValidation(control:AbstractControl){
        var regExp = /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z0-9]{1,8}$/;
        if(regExp.test(control.value)){
            return true;
        }else{
            return false;
        }
    } */
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        this.mobileErrorMessage = '';
        this.emailErrorMessage = '';
        /* if(!this.agree){

            this.signUpForm.get('agree').setErrors({'agree':{message:'Please agree the terms of conditions and privacy policy'}});
            return;
        } */
        // Do nothing if the form is invalid
        /*if ( this.signUpForm.invalid )
        {
            if(this.signUpForm.controls['recaptcha'].value == null){
                this.signUpForm.controls['recaptcha'].setValue('');
            }
             if(this.signUpForm.controls['agree'].value == ''){
                setTimeout(() => {
                    this.signUpForm.get('agree').setErrors({'agree':{message:'Please agree the terms of conditions and privacy policy'}});
                });
            } 
            
            return;
        }*/

        if(this.signUpForm.controls['recaptcha'].value == null){
            this.signUpForm.controls['recaptcha'].setValue('');
        }

        // Sign up
        if ( this.signUpForm.valid && this.signUpForm.controls['recaptcha'].value == '')
        {

            // Disable the form
            this.signUpForm.disable();

            // Hide the alert
            this.showAlert = false;
        this._authService.register(this.signUpForm.value)
            .subscribe(
                (data:any) => {
                    console.log(data);
                    this.successResponse = this.encrypt.decryptData(data.data);
                    console.log(this.successResponse);
                    this._authService.accessToken = this.successResponse.data.token;
                    const role_id = this.encrypt.encryptData(this.successResponse.data.role_id).data.toString();
                    localStorage.setItem('accessModifier',role_id);
                    localStorage.setItem('verification',this.encrypt.encryptData(this.successResponse.data.status).data.toString()); 
                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/confirmation-required');
                },
                (error:any) => {
                    console.log(error);
                    this.errorResponse = this.encrypt.decryptData(error.error.data);
                    console.log(this.errorResponse);
                    this.signUpForm.get('mobile_number').setErrors({serverError:{ message: 'Show server error :)' }});
                    this._cdr.detectChanges();
                    const ex: ValidationErrors = { 'exists': true };
                    setTimeout(() => {
                        this.signUpForm.get('email_address').setErrors(ex);
                    });
                    

                    if(this.errorResponse.data.email_address != undefined && this.errorResponse.data.mobile_number != undefined){
                        setTimeout(() => {
                            this.signUpForm.get('email_address').setErrors({'exists':{message:this.errorResponse.data.email_address}});
                            this.signUpForm.get('mobile_number').setErrors({'exists':{message:this.errorResponse.data.mobile_number}});
                        });
                        
                        console.log('here1');
                    }else if(this.errorResponse.data.email_address != undefined){
                        setTimeout(() => {
                            this.signUpForm.get('email_address').setErrors({'exists':{message:this.errorResponse.data.email_address}});
                            this.signUpForm.get('mobile_number').setErrors(null);
                        });
                    }else if(this.errorResponse.data.mobile_number != undefined){
                        setTimeout(() => {
                            this.signUpForm.get('mobile_number').setErrors({'exists':{message:this.errorResponse.data.mobile_number}});
                            this.signUpForm.get('email_address').setErrors(null);
                        });
                    }else{
                        setTimeout(() => {
                            this.signUpForm.get('mobile_number').setErrors(null);
                            this.signUpForm.get('email_address').setErrors(null);
                        });
                    }
                    console.log(this.signUpForm);
                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    //this.signUpNgForm.resetForm();
                    
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
        }    
    }
    public resolved(captchaResponse: string): void {
        console.log(`Resolved captcha with response: ${captchaResponse}`);
      }
    
      public onError(errorDetails: RecaptchaErrorParameters): void {
        console.log(`reCAPTCHA error encountered; details:`, errorDetails);
      }
      openPopup(page){
        const dialogRef = this.elements.open(TermsOfServiceComponent, {
            data: {'agree':false,'page':page},
            hasBackdrop: false,
            panelClass:'element-layout-dialog'
          });
    
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if(result.agree){
                setTimeout(() => {
                    this.signUpForm.get('agree').setErrors(null);
                });
            }else{
                setTimeout(() => {
                    this.signUpForm.get('agree').setErrors({'agree':{message:'Please agree the terms of conditions and privacy policy'}});
                });
                //this.signUpForm.get('agree').setErrors({'agree':{message:'Please agree the terms of conditions and privacy policy'}});
            }
            console.log('The dialog was closed');
          });
      }
}
