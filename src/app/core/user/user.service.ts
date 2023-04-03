import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { EncryptDecryptService } from '../encrypt-decrypt.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private encrypt: EncryptDecryptService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        //console.log(value);
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        /* return this._user.pipe(tap((user) => {
           console.log(user); 
        })); */

        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        if (role == '2') {
            api_url =
                environment.API_BASE_URL +
                '' +
                environment.API_DOCTOR_URL +
                'get-user';
        } else {
            api_url =
                environment.API_BASE_URL +
                '' +
                environment.API_ADMIN_URL +
                'get-user';
        }
        return this._httpClient
            .get<User>(api_url, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    // console.log(decryptData);
                    return of(decryptData.data);
                })
            );
        return this._user.asObservable();
        /* return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        ); */
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User) {
        //return this._httpClient.patch<User>('api/common/user', {user}).pipe(
        //map((response) => {
        return this._user.next(user);
        /*     })
        ); */
    }
}
