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
export class AdminService {

  roleEncryption = localStorage.getItem('accessModifier');
  constructor(private encrypt: EncryptDecryptService, private _httpClient: HttpClient) {

  }
  getPatientList(request) {
    const accessToken = localStorage.getItem('accessToken');
    let roleEncryption = localStorage.getItem('accessModifier');
    const role = this.encrypt.decryptData(roleEncryption).toString();
    let api_url = '';
    if (role == '1' || role == '6') {
      api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'patient/get';
    }
    console.log(api_url);
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
  getUserPatientList(request){
    const accessToken = localStorage.getItem('accessToken');
    let roleEncryption = localStorage.getItem('accessModifier');
    const role = this.encrypt.decryptData(roleEncryption).toString();
    let api_url = '';
    if (role == '1' || role == '6') {
      api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'adminAccount/getuserpatientlist';
    }
    console.log(api_url);
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
  getOrganizationList(request) {
    const accessToken = localStorage.getItem('accessToken');
    let roleEncryption = localStorage.getItem('accessModifier');
    const role = this.encrypt.decryptData(roleEncryption).toString();
    let api_url = '';
    if (role == '1' || role == '6') {
      api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'adminAccount/get-list';
    }

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
  changeStatus(request) {
    const accessToken = localStorage.getItem('accessToken');
    let roleEncryption = localStorage.getItem('accessModifier');
    const role = this.encrypt.decryptData(roleEncryption).toString();
    let api_url = '';
    if (role == '1' || role == '6') {
      api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'patient/change-status';
    }

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
  changeAccountStatus(request){
    const accessToken = localStorage.getItem('accessToken');
    let roleEncryption = localStorage.getItem('accessModifier');
    const role = this.encrypt.decryptData(roleEncryption).toString();
    let api_url = '';
    if (role == '1' || role == '6') {
      api_url = environment.API_BASE_URL + '' + environment.API_ADMIN_URL + 'adminAccount/change-status';
    }
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
  fileExport(encryptedRequest){
    const accessToken = localStorage.getItem('accessToken');
      let roleEncryption = localStorage.getItem('accessModifier');
      const role =  this.encrypt.decryptData(roleEncryption).toString();
      console.log(role);
    console.log('testing');
      let api_url = '';
      api_url = environment.API_BASE_URL+''+environment.API_ADMIN_URL+'patient/fileExport';
    /*return this._httpClient.post<any>(api_url,encryptedRequest,{
        headers:{
          'Accept': 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet',
          'authorization':'Bearer '+accessToken
          },
      }*/
      let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet');
        headers = headers.set('authorization','Bearer '+accessToken);
      return this._httpClient.post(api_url,  encryptedRequest,{ headers: headers, responseType: 'blob' as 'json' }).pipe(switchMap((data:any) => {
        /*console.log(data);
        console.log('000000');
          const decryptData = this.encrypt.decryptData(data.data);
          console.log(decryptData);
          console.log('aaaaaaa');*/
          return of(data);
      }));
  }
  recordsfileExport(encryptedRequest){
      const accessToken = localStorage.getItem('accessToken');
      let roleEncryption = localStorage.getItem('accessModifier');
      const role =  this.encrypt.decryptData(roleEncryption).toString();
      console.log(role);    
      let api_url = '';
      api_url = environment.API_BASE_URL+''+environment.API_ADMIN_URL+'patient/recordsfileExport';
      let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet');
        headers = headers.set('authorization','Bearer '+accessToken);
      return this._httpClient.post(api_url,  encryptedRequest,{ headers: headers, responseType: 'blob' as 'json' });
  }
  DoctorsFileExport(encryptedRequest){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        console.log(role);
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'adminAccount/doctorsListfileExport';
        let headers = new HttpHeaders();
        headers = headers.set(
            'Accept',
            'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet'
        );
        headers = headers.set('authorization', 'Bearer ' + accessToken);
        return this._httpClient
            .post(api_url, encryptedRequest, {
                headers: headers,
                responseType: 'blob' as 'json',
            })
            .pipe(
                switchMap((data: any) => {
                    return of(data);
                })
            );
    }
  getPatientDetail(patientUuid){
    const accessToken = localStorage.getItem('accessToken');
    let roleEncryption = localStorage.getItem('accessModifier');
    const role =  this.encrypt.decryptData(roleEncryption).toString();
    let api_url = '';
    api_url = environment.API_BASE_URL+''+environment.API_ADMIN_URL+'patient/getDetail';
    return this._httpClient.post<any>(api_url,patientUuid,{
        headers:{
          'content-type': 'application/json',
          'authorization':'Bearer '+accessToken
          },
      }).pipe(switchMap((data:any) => {
          const decryptData = this.encrypt.decryptData(data.data);
          return of(decryptData);
      }));
  }
  getStates(){
    const accessToken = localStorage.getItem('accessToken');
    let roleEncryption = localStorage.getItem('accessModifier');
    const role =  this.encrypt.decryptData(roleEncryption).toString();
    let api_url = '';
    //if(role == '2'){    
        api_url = environment.API_BASE_URL+''+environment.API_DOCTOR_URL+'states';
    //}
    
    return this._httpClient.get<any>(api_url,{
        headers:{
          'content-type': 'application/json',
          'authorization':'Bearer '+accessToken
          },
      }).pipe(switchMap((data:any) => {
          const decryptData = this.encrypt.decryptData(data.data);
          return of(decryptData);
      }));
  }
  updatePatient(patientDetails){
    console.log(patientDetails);
      const accessToken = localStorage.getItem('accessToken');
      let roleEncryption = localStorage.getItem('accessModifier');
      const role =  this.encrypt.decryptData(roleEncryption).toString();
      let api_url = '';
      api_url = environment.API_BASE_URL+''+environment.API_DOCTOR_URL+'patient/update';

      return this._httpClient.post<any>(api_url,patientDetails,{
        headers:{
          'authorization':'Bearer '+accessToken
          },
      }).pipe(switchMap((data:any) => {
          const decryptData = this.encrypt.decryptData(data.data);
          console.log(decryptData);
          return of(decryptData);
      }));
  }
  getUserDetails(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'adminAccount/getUserDetils';

        return this._httpClient
            .post<any>(api_url, request, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    return of(decryptData);
                })
            );
    }
  updateUserDetails(userDetails) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'adminAccount/updateuserdetails';

        return this._httpClient
            .post<any>(api_url, userDetails, {
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
    getStaffList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'adminAccount/getStaffList';

        return this._httpClient
            .post<any>(api_url, request, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    return of(decryptData);
                })
            );
    }
    addAdminDetails(adminDetails) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/addAdmin';

        return this._httpClient
            .post<any>(api_url, adminDetails, {
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
  getadminList(getAdminParams){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/getAdminList';
            
        return this._httpClient
            .post<any>(api_url, getAdminParams, {
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
  doctorDetailsExport(encryptedRequest) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'adminAccount/generatePdfDoctorDetails';
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        headers = headers.set('authorization', 'Bearer ' + accessToken);
        return this._httpClient
            .post(api_url, encryptedRequest, {
                headers: headers,
                responseType: 'blob' as 'json',
            })
            .pipe(
                switchMap((data: any) => {
                    return of(data);
                })
            );
    }
}
