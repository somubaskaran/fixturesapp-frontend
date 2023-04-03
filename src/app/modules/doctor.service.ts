import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class DoctorService {
    roleEncryption = localStorage.getItem('accessModifier');
    constructor(
        private encrypt: EncryptDecryptService,
        private _httpClient: HttpClient
    ) {}
    getPatientList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if (role == '2') {
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/get';
        //}

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
    getStates() {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'states';
        //}

        return this._httpClient
            .get<any>(api_url, {
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
    getDoctors() {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'doctors';
        //}

        return this._httpClient
            .get<any>(api_url, {
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
    addPatient(patientDetails) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/insert';

        return this._httpClient
            .post<any>(api_url, patientDetails, {
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

    updatePatient(patientDetails) {
        console.log(patientDetails);
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/update';

        return this._httpClient
            .post<any>(api_url, patientDetails, {
                headers: {
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
    deletePatient(patientUuid) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/remove';

        return this._httpClient
            .post<any>(api_url, patientUuid, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    addBulkUpload(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'xlpatientupload/insert';
        return this._httpClient
            .post<any>(api_url, request, {
                headers: {
                    /*'content-type': 'application/json',*/
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    console.log(decryptData);
                    console.log('aaaaaaa');
                    return of(decryptData);
                })
            );
    }
    fileExport(encryptedRequest) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        console.log(role);
        console.log('testing');
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/fileExport';
        /*return this._httpClient.post<any>(api_url,encryptedRequest,{
        headers:{
          'Accept': 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet',
          'authorization':'Bearer '+accessToken
          },
      }*/
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
                    /*console.log(data);
        console.log('000000');
          const decryptData = this.encrypt.decryptData(data.data);
          console.log(decryptData);
          console.log('aaaaaaa');*/
                    return of(data);
                })
            );
    }
    recordsfileExport(encryptedRequest) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        console.log(role);
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/recordsfileExport';
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
    getKittingList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'kitting/get';
        //}

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
    addKitting(kittingDetails) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'kitting/update';

        return this._httpClient
            .post<any>(api_url, kittingDetails, {
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
    getDeviceType() {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'kitting/getDevicetype';

        return this._httpClient
            .get<any>(api_url, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    getDeviceModel(deviceTypeId) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'kitting/getDeviceModel';

        return this._httpClient
            .post<any>(api_url, deviceTypeId, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    UpdateKitingStatus(kittingStatus) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'kitting/UpdateKitingStatus';

        return this._httpClient
            .post<any>(api_url, kittingStatus, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    RemoveKiting(kittingUuid) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'kitting/DeleteKitting';

        return this._httpClient
            .post<any>(api_url, kittingUuid, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    ApiHeaderToken: any =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNmZXJyYXJpQGVkZXZpY2UuY29tIiwicm9sZSI6MTAsImN1c3RvbWVyIjoiOGFiMmQ2YTEtNmI1OC00NTA2LTg5NzgtYmM3MThlOTAyNDU4IiwiaWF0IjoxNjMxMDEzOTI0fQ.f5oisl0NvQmeONvWxZ25oq03hGtIJTUxi294RRMsy0k';

    apicheck() {
        const accessToken = localStorage.getItem('accessToken');
        let api_url = 'https://ccabackend.edevice.com/api/devices';
        //let api_url = environment.API_BASE_URL+''+environment.API_DOCTOR_URL+'kitting/test';
        return this._httpClient
            .get<any>(api_url, {
                headers: {
                    'content-type': 'application/json',
                    authorization: this.ApiHeaderToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    console.log('API check');
                    console.log(data);
                    return of(data);
                })
            );
    }

    ApiAddDevice(ApiDeviceData) {
        const accessToken = localStorage.getItem('accessToken');
        let api_url = 'https://ccabackend.edevice.com/api/devices';
        return this._httpClient
            .post<any>(api_url, ApiDeviceData, {
                headers: {
                    'content-type': 'application/json',
                    authorization: this.ApiHeaderToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    console.log('API check');
                    console.log(data);
                    return of(data);
                }),
                catchError((error: any) => {
                    console.log(error);
                    return of(error);
                })
            );
    }
    ApiAddKitting(ApiKittingData) {
        const accessToken = localStorage.getItem('accessToken');
        let api_url = 'https://ccabackend.edevice.com/api/kits/btAddress';
        return this._httpClient
            .post<any>(api_url, ApiKittingData, {
                headers: {
                    'content-type': 'application/json',
                    authorization: this.ApiHeaderToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    console.log('API check');
                    console.log(data);
                    return of(data);
                }),
                catchError((error: any) => {
                    console.log(error);
                    return of(error);
                })
            );
    }
    ApideleteDevice(btAddress) {
        const accessToken = localStorage.getItem('accessToken');
        /*let api_url =
            'https://ccabackend.edevice.com/api/devices/btAddress/' +
            btAddress +
            '/true';*/
        let api_url = 'https://ccabackend.edevice.com/api/kits/device/btAddress/'+btAddress;
        console.log(api_url);
        return this._httpClient
            .delete<any>(api_url, {
                headers: {
                    'content-type': 'application/json',
                    authorization: this.ApiHeaderToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    console.log('API check');
                    console.log(data);
                    return of(data);
                }),
                catchError((error: any) => {
                    console.log(error);
                    return of(error);
                })
            );
    }
    getPatientDetail(patientUuid) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if (role == '2') {
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/getDetail';
        //}

        return this._httpClient
            .post<any>(api_url, patientUuid, {
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
    //TODO
    getToDoList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'todo/get';
        //}

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

    deleteToDo(todoUuid) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'todo/DeleteToDo';

        return this._httpClient
            .post<any>(api_url, todoUuid, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }

    changeStatusToDo(todoUuid) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'todo/changeStatusToDo';

        return this._httpClient
            .post<any>(api_url, todoUuid, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }

    getActivePatientList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if (role == '2') {
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/getactivelist';
        //}

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
    getActivePatientListCities(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if (role == '2') {
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/getactivelistcities';
        //}

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
    updateToDO(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'todo/update';
        //}

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
    addToDO(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'todo/add';
        //}

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
    //TODO

    //Patient Recorded Time
    getPatientRecordTime(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_time_log/get';
        //}

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

    deleteTimeLog(todoUuid) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_time_log/deleteTimeLog';

        return this._httpClient
            .post<any>(api_url, todoUuid, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    insertManualTimeLog(patientDetails) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_time_log/insert';

        return this._httpClient
            .post<any>(api_url, patientDetails, {
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

    //get patient reading datas
    getPatientReadings(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/getPatientReadings';

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
    getPeriodicVitalList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/getPeriodicVitalList';

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
    getPatientReadingsGraph(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/getPatientReadingsGraph';

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
    //get patient reading datas

    //Patient Notes
    getPatientNotes(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_notes/get';
        //}

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

    deletePatientNotes(todoUuid) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_notes/deletenotes';

        return this._httpClient
            .post<any>(api_url, todoUuid, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    savePatientNotes(patientDetails) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_notes/insert';

        return this._httpClient
            .post<any>(api_url, patientDetails, {
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
    changeFav(kittingStatus) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_notes/changeFavorite';

        return this._httpClient
            .post<any>(api_url, kittingStatus, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    sendTexts(kittingStatus) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient_notes/sendTexts';

        return this._httpClient
            .post<any>(api_url, kittingStatus, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    //Patient Notes
    //Get Staff List
    getStaffList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/getStaffList';

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

    //Update threshold

    updatePatientThreshold(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/updatethreshold';

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
    //update threshold

    addUserProfile(patientDetails) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/addStaff';

        return this._httpClient
            .post<any>(api_url, patientDetails, {
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

    getInvetedMembers(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/getInvetedMembers';

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
    reInviteDelete(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/reInviteDelete';

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
    userChangePassword(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/changepassword';

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
    getUserDetails(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/getUserDetils';

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
            environment.API_DOCTOR_URL +
            'staff/updateuserdetails';

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
    updateCheckList(checkList) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/updatechecklist';

        return this._httpClient
            .post<any>(api_url, checkList, {
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
    getCheckList(roleId) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'staff/getchecklist';

        return this._httpClient
            .post<any>(api_url, roleId, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    // console.log(decryptData);
                    return of(decryptData);
                })
            );
    }

    //Billing
    getBillingList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'billing/get';
        //}

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

    updatePaidStatus(kittingStatus) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'billing/updatePaidStatus';

        return this._httpClient
            .post<any>(api_url, kittingStatus, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    billingfileExport(encryptedRequest) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        console.log(role);
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'billing/billingfileExport';
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
    //Billing
    //Alert
    getAlertList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'alerts/get';
        //}

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

    changeStatusAlert(alertStatus) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'alerts/changeStatusAlert';

        return this._httpClient
            .post<any>(api_url, alertStatus, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    resolveAlerts(objData) {
        console.log(objData);
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'alerts/resolveAlerts';

        return this._httpClient
            .post<any>(api_url, objData, {
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + accessToken,
                },
            })
            .pipe(
                switchMap((data: any) => {
                    const decryptData = this.encrypt.decryptData(data.data);
                    //console.log(decryptData);
                    return of(decryptData);
                })
            );
    }
    //Alert

    //Reading Status
    getReadingStatusList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'reading_status/get';

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
    //Reading Status

    //Records
    getRecordsList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'records/get';
        //}

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

    fileExportPatientList(encryptedRequest) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'records/fileExport';
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

    getRecordPDF(encryptedRequest) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'records/generatePdf';
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

    getPatientRecordPDF(encryptedRequest) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'patient/generatePdf';
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
    getRemovedPatientList(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'records/get_removed_patient';
        //}

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
    // getRecordPDF(request) {
    //     const accessToken = localStorage.getItem('accessToken');
    //     let roleEncryption = localStorage.getItem('accessModifier');
    //     const role = this.encrypt.decryptData(roleEncryption).toString();
    //     let api_url = '';
    //     //if(role == '2'){
    //     api_url =
    //         environment.API_BASE_URL +
    //         '' +
    //         environment.API_DOCTOR_URL +
    //         'records/generatePdf';
    //     //}

    //     return this._httpClient
    //         .post<any>(api_url, request, {
    //             headers: {
    //                 'content-type': 'application/json',
    //                 authorization: 'Bearer ' + accessToken,
    //             },
    //         })
    //         .pipe(
    //             switchMap((data: any) => {
    //                 const decryptData = this.encrypt.decryptData(data.data);
    //                 return of(decryptData);
    //             })
    //         );
    // }
    //Records

    //Admin Dashboard
    getAdminDashboardDetails(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'dashboard';
        //}

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
    getAdminDashboardForPatientDetails(request) {
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_ADMIN_URL +
            'dashboard_patients';
        //}

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
    //Admin Dashboard
    //Doctor Dashboard
    getAlertNotification(request){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'dashboard/notificationalerts';
        //}

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
    getTodoCount(request){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'dashboard/todocount';
        //}

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
    getActiveInactiveCount(request){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'dashboard/getActiveInactiveCount';
        //}

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
    getPatientEnrolled(request){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'dashboard/getPatientEnrolled';
        //}

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
    getDeviceUsage(request){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'dashboard/getDeviceUsage';
        //}

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
    getThresholdCount(request){
        const accessToken = localStorage.getItem('accessToken');
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let api_url = '';
        //if(role == '2'){
        api_url =
            environment.API_BASE_URL +
            '' +
            environment.API_DOCTOR_URL +
            'dashboard/getThresholdCount';
        //}

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
}
