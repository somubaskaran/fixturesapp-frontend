import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { errorResponseData, successResponseData } from 'app/core/response-schema';
import { UserService } from 'app/core/user/user.service';
import { TermsOfServiceComponent } from '../terms-of-service/terms-of-service.component';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    styleUrls    :  ['./sign-in.component.css']
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    errorResponse:errorResponseData;
    successResponse:successResponseData;
    errorMessage:string;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _userService:UserService,
        private encrypt:EncryptDecryptService,
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
        // Create the form
        this.signInForm = this._formBuilder.group({
            email_address: ['', [Validators.required, Validators.email, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
            password: ["", [Validators.required]],
            rememberMe: [""],
            agree:[""]
        });
        this._authService.signOut();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        console.log('here');
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                (data) => {
                   
                    this.successResponse = this.encrypt.decryptData(data.data);
                    console.log('somu');
                    console.log(this.successResponse);
                    this._router.navigateByUrl('admin/dashboard');
                    //this._authService._authenticated = true;
                    // this._authService.accessToken = this.successResponse.data.token;
                    // this._userService.user = this.successResponse.data;
                    // const role_id = this.encrypt.encryptData(this.successResponse.data.role_id).data.toString();
                    // localStorage.setItem('accessModifier',role_id); 
                    // if( this.successResponse.data.status == 2){
                    //     localStorage.removeItem('authenticated');
                    //     localStorage.setItem('verification',role_id);
                    //     this._router.navigateByUrl('/confirmation-required');
                    // }else{
                    //     let redirectURL;
                        /*if(this.successResponse.data.role_id == 2){
                            redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/doctor/dashboard';
                        }else{
                            redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/admin/dashboard';
                        }*/
                        // if(this.successResponse.data.role_id == 1){
                        //     redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/admin/dashboard';
                        // }else{
                        //     redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/doctor/dashboard';
                        // }
                        // localStorage.setItem('path',redirectURL);
                        // console.log(redirectURL);
                        // // Navigate to the redirect url
                        // this._router.navigateByUrl(redirectURL);
                    //}
                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                   /*  const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    console.log(redirectURL);
                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL); */

                },
                (error:any) => {
                    console.log(error);
                    this.errorResponse = this.encrypt.decryptData(error.error.data);
                    console.log(this.errorResponse);
                    // Re-enable the form
                    this.signInForm.enable();
                    

                    // Reset the form
                    //this.signInNgForm.resetForm();

                    // Set the alert

                    this.alert = {
                        type: 'error',
                        message: this.errorResponse.msg,
                    };
                    // Show the alert
                    this.showAlert = true;
                    setTimeout(() => {
                        this.showAlert = false;

                    },5000);
                }
            );
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
                    this.signInForm.get('agree').setErrors(null);
                });
            }else{
                setTimeout(() => {
                    this.signInForm.get('agree').setErrors({'agree':{message:'Please agree the terms of conditions and privacy policy'}});
                });
                //this.signUpForm.get('agree').setErrors({'agree':{message:'Please agree the terms of conditions and privacy policy'}});
            }
            console.log('The dialog was closed');
          });
      }
}
