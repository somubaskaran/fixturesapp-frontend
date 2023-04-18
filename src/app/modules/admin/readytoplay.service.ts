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

export class Readytoplay {
    constructor(private encrypt: EncryptDecryptService, private _httpClient: HttpClient) {

    }

    getMatchList(request) {
        const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'readytoplay/getList';
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

    getmatchInfo(request){
        const accessToken = "";
          let api_url = '';
          api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/getmatchInfo';
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

    matchDetails(request){
        const accessToken = "";
          let api_url = '';
          api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/matchDetails';
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

    finishMatch(request){
        const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/finishmatch';
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
