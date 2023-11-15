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

export class MatchService {
    constructor(private encrypt: EncryptDecryptService, private _httpClient: HttpClient) {

    }

    addMatch(matchDetails) {
        const accessToken = "";
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'match/add';
        return this._httpClient
            .post<any>(api_url, matchDetails, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    console.log(decryptData);
                    return of(decryptData);
                })
            );
    }

    getMatchList(request) {
        //  const accessToken = localStorage.getItem('accessToken');
        //  let roleEncryption = localStorage.getItem('accessModifier');
        // const role = this.encrypt.decryptData(roleEncryption).toString();
        // let api_url = '';
        // if (role == '1' || role == '6') {
        //   api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'patient/get';
        // }
        // console.log(api_url);
        const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/getMatchList';
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
    getTournmentCategoryList(request){
      const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/getTournmentCategoryList';
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
    getTournmentDetail(request){
        const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/getMatchDetail';
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
    getPlayersList(request){
      const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'player/getPlayerList';
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
    addPlayer(request){
      const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'player/add';
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
    startMatch(request){
      const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/start';
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
    nextRound(request){
      const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/nextround';
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
    readyToPlayMatch(request){
      const accessToken = "";
        let api_url = '';
        api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/readyToPlayMatch';
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
        
  getUpdatedMatchNumber(request) {
    const accessToken = "";
    let api_url = '';
    api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/updatedMatchNumber';
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
  updateMatchToMatch(request) {
    const accessToken = "";
    let api_url = '';
    api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/updateMatchToMatch';
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
  updateByeToMatch(request) {
    const accessToken = "";
    let api_url = '';
    api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/updateByeToMatch';
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
  updateMatchToBye(request) {
    const accessToken = "";
    let api_url = '';
    api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/updateMatchToBye';
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
  goToNextRound(request) {
    const accessToken = "";
    let api_url = '';
    api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'match/goToNextRound';
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