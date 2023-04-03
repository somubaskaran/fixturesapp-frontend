import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PointsService {
    constructor(private encrypt: EncryptDecryptService, private _httpClient: HttpClient) {

    }

    getPoints(request){
        const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'points/getpoints';
        return this._httpClient.post<any>(api_url, request, {
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + accessToken
        },
        }).pipe(switchMap((data: any) => {
        const decryptData = this.encrypt.decryptData(data.data);
        console.log(decryptData);
        return of(decryptData);
        }));
    }
    removePoints(request){
        const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'points/removepoint';
        return this._httpClient.post<any>(api_url, request, {
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + accessToken
        },
        }).pipe(switchMap((data: any) => {
        const decryptData = this.encrypt.decryptData(data.data);
        console.log(decryptData);
        return of(decryptData);
        }));
    }
    addPoints(request){
        const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'points/addpoint';
        return this._httpClient.post<any>(api_url, request, {
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + accessToken
        },
        }).pipe(switchMap((data: any) => {
        const decryptData = this.encrypt.decryptData(data.data);
        console.log(decryptData);
        return of(decryptData);
        }));
    }
}    