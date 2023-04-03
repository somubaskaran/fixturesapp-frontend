import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'auth-confirmation-required',
    templateUrl: './confirmation-required.component.html',
    styleUrls: ['./confirmation.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthConfirmationRequiredComponent implements OnInit {
    responseData: successResponseData;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;
    user: User = {
        email_address: '',
        name: '',
        status: '',
        id: '',
        mobile_number: null,
    };
    subStringEmail: string = '';
    subStringMobile: string = '';
    verificationForm: FormGroup;
    errorMessage: string = '';
    successMessage:string = '';
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private auth: AuthService,
        private encrypt: EncryptDecryptService,
        private router: Router,
        private fb: FormBuilder
    ) {}
    ngOnInit() {
        this.verificationForm = this.fb.group({
            mail_otp: ['', [Validators.required]],
            sms_otp: ['', [Validators.required]],
        });
        this._userService.get().subscribe(
            (data) => {
                console.log(data);
                this.user = data;
                let email_address = this.user.email_address.substring(
                    0,
                    this.user.email_address.lastIndexOf('@')
                );
                this.subStringEmail =
                    email_address.replace(email_address.substring(3), '***') +
                    this.user.email_address.substring(
                        this.user.email_address.lastIndexOf('@')
                    );
                console.log(this.subStringEmail);
                this.subStringMobile =
                    this.user.mobile_number.toString().substring(0, 2) +
                    '******' +
                    this.user.mobile_number.toString().slice(-2);
            },
            (error) => {
                console.log(error);
            }
        );
    }
    submitCode() {
        // Return if the form is invalid
        if (this.verificationForm.invalid) {
            return;
        }

        // Disable the form
        this.verificationForm.disable();

        // Hide the alert

        // Sign in
        console.log('here');
        this.auth.verifyCode(this.verificationForm.value).subscribe(
            (data: any) => {
                this.responseData = this.encrypt.decryptData(data.data);
                localStorage.removeItem('verification');
                localStorage.setItem('authenticated', 'true');
                localStorage.setItem(
                    'accessToken',
                    this.responseData.data.token
                );
                //if(this.responseData.data.role_id == '1'){
                    this.router.navigateByUrl('/admin/dashboard');
                // }else {
                //     this.router.navigateByUrl('/doctor/dashboard');
                // }
                
            },
            (error: any) => {
                this.responseData = this.encrypt.decryptData(error.error.data);
                console.log(this.responseData);
                // Re-enable the form
                this.showAlert = true;
                this.verificationForm.enable();
                this.errorMessage = this.responseData.msg;
                this.alert = {
                    type: 'error',
                    message:this.responseData.msg,
                };

                setTimeout(() => {
                    this.showAlert = false;
                },5000);
            }
        );
    }
    resendCode(){
        this.auth.resendCode().subscribe(
            (data: any) => {
                this.responseData = this.encrypt.decryptData(data.data);
                this.showAlert = true;
                console.log(this.responseData);
                this.alert = {
                    type: 'success',
                    message:this.responseData.msg,
                };

                setTimeout(() => {
                    this.showAlert = false;
                },5000);
            },
            (error: any) => {
                this.responseData = this.encrypt.decryptData(error.error.data);
                console.log(this.responseData);
                this.errorMessage = this.responseData.msg;
                this.showAlert = true;
                this.alert = {
                    type: 'error',
                    message:this.responseData.msg,
                };
                setTimeout(() => {
                    this.showAlert = false;
                },5000);
            }
        );
    }
}
