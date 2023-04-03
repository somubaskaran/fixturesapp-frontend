import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { EncryptDecryptService } from '../encrypt-decrypt.service';
import { environment } from 'environments/environment';
import { errorResponseData, successResponseData } from '../response-schema';
import { User } from '../user/user.types';
import { Router } from '@angular/router';


@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    response:successResponseData;
    error:errorResponseData;
    
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private encrypt:EncryptDecryptService,
        private _router:Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    
    {

        const encryptedRequest = this.encrypt.encryptData(JSON.stringify({'email_address':email}));
        const API_URL = environment.API_BASE_URL+""+environment.API_PATH+'forgot-password';
        return this._httpClient.post(API_URL, encryptedRequest,{
            headers:{
              'content-type': 'application/json'
            }
        });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(resetForm): Observable<any>
    {
        const encryptedRequest = this.encrypt.encryptData(JSON.stringify(resetForm));
        const API_URL = environment.API_BASE_URL+""+environment.API_PATH+'reset-password';
        return this._httpClient.post(API_URL, encryptedRequest,{
            headers:{
              'content-type': 'application/json'
            }
        });
    }

    checkCodeExists(request): Observable<any>
    {
        const encryptedRequest = this.encrypt.encryptData(JSON.stringify(request).trim());
        const API_URL = environment.API_BASE_URL+""+environment.API_PATH+'check-reset-exists';
        return this._httpClient.post(API_URL, encryptedRequest,{
            headers:{
              'content-type': 'application/json'
            }
        });
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email_address: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        } 

        const encryptedRequest = this.encrypt.encryptData(JSON.stringify(credentials));
        const API_URL = environment.API_BASE_URL+""+environment.API_PATH+'login';
        return this._httpClient.post(API_URL,encryptedRequest,{
            headers:{
              'content-type': 'application/json'
            }
        }).pipe(
            switchMap((response:any) => {
                this._authenticated = true;
                localStorage.setItem('authenticated','true');
                return of(response);
            })
        );            
        /* return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        ); */
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessModifier');
        localStorage.removeItem('authenticated');
        localStorage.removeItem('verification');
        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /** 
     * Check the authentication status
     */
    check(): Observable<any>
    {
       

        // Check if the user is logged in
        if ( localStorage.getItem('authenticated') == 'true')
        {
            return of(true);
        }
        
        if ( localStorage.getItem('verification') != undefined)
        {
            return of({'verification':true,'path':'confirmation-required'});
        }
        
        

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    register(register):Observable<any>
    {
        const encryptedRequest = this.encrypt.encryptData(JSON.stringify(register));
        const API_URL = environment.API_BASE_URL+""+environment.API_PATH+'register';   
        return this._httpClient.post(API_URL,encryptedRequest)/* .pipe(
            catchError((error) => {

                // Return false
                return of(error);
            }),
            switchMap((result: any) => {
                if(result.status  == 422){
                    return of(result);
                }
                const response = this.encrypt.decryptData(result.data);

                // Store the access token in the local storage
                this.accessToken = response.data.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                let user:User;
                user.email_address = response.data.email_address;
                user.id = response.data.uuid;
                user.mobile_number = response.data.mobile_number;
                user.name = response.data.name;
                user.status = response.data.status;
                this._userService.user = user;

                // Return true
                return of(result);
            })
        ); */;

    }
    verifyCode(verifyForm):Observable<any>
    {
        const encryptedRequest = this.encrypt.encryptData(JSON.stringify(verifyForm));
        const accessToken = localStorage.getItem('accessToken');
        const API_URL = environment.API_BASE_URL+""+environment.API_PATH+'verify-otp';   
        return this._httpClient.post(API_URL,encryptedRequest,{
            headers:{
              'content-type': 'application/json',
              'authorization':'Bearer '+accessToken
            }
        });
    }    
    resendCode():Observable<any>{
        const accessToken = localStorage.getItem('accessToken');
        const API_URL = environment.API_BASE_URL+""+environment.API_PATH+'resend-otp';   
        return this._httpClient.get(API_URL,{
            headers:{
              'content-type': 'application/json',
              'authorization':'Bearer '+accessToken
            }
        });
    }
}
