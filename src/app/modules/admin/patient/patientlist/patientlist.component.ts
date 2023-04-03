import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { AdminService } from '../../admin.service';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';
import * as XLSX from 'xlsx';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
/*import { ExcelService } from './excel.service';*/
/**
 * An object used to get page information from the server
 */
export class patientListPageData {
    // The number of elements in the page
    size: number = 0;
    // The total number of elements
    totalElements: number = 0;
    // The total number of pages
    totalPages: number = 0;
    // The current page number
    pageNumber: number = 0;
    requests: any = '';
}

@Component({
    selector: 'app-patientlist',
    templateUrl: './patientlist.component.html',
    styleUrls: ['./patientlist.component.scss'],
})
export class PatientlistComponent implements OnInit {
    roleId: number;
    roles = [
        { id: 1, name: 'Super Admin' },
        { id: 6, name: 'Admin' },
    ];
    @ViewChild('search', { static: false }) search: ElementRef;
    addClass: string = 'list';
    encryptedResponse: successResponseData;
    errorResponse: successResponseData;
    serverResponse = new BehaviorSubject<any[]>([]);
    response = this.serverResponse.asObservable();

    units: any;
    list: any[] = [];
    total: number = 0;
    active: number = 0;
    selected = 'desc';
    alertPopup: FuseConfirmationConfig = {
        title: '',
        message: '',
        icon: {
            color: 'warn',
            name: '',
            show: false,
        },
        actions: {
            cancel: {
                show: false,
                label: '',
            },
            confirm: {
                color: 'warn',
                label: '',
                show: false,
            },
        },
        dismissible: false,
    };
    systemTotal: number = 0;
    sorting: any;
    inactive: number = 0;
    patientDetails;
    page = {
        limit: 5,
        count: 0,
        offset: 0,
        orderBy: 'myColumn1',
        orderDir: 'desc',
    };
    page1 = new patientListPageData();

    columns = [{ prop: 'first_name' }, { name: 'Gender' }, { name: 'Company' }];
    requestParam: {
        current: number;
        pasgesize: number;
        filter: string;
        status: string;
        type: string;
        blood_pressure: number;
        pulse: number;
        order: { direction: string; active: string };
    } = {
        current: 0,
        pasgesize: 10,
        filter: '',
        status: '',
        type: 'desc',
        blood_pressure: 5,
        pulse: 5,
        order: { direction: '', active: '' },
    };

    constructor(
        private service: AdminService,
        private encrypt: EncryptDecryptService,
        private _fuseConfirmationService: FuseConfirmationService,
        private spinner: NgxSpinnerService,
        private router: Router /*private excelService: ExcelService*/
    ) {
        let roleEncryption = localStorage.getItem('accessModifier');
        let currentPath = localStorage.getItem('path');
        //console.log(this._router.url);
        if (roleEncryption != null) {
            this.roleId = Number(
                this.encrypt.decryptData(roleEncryption).toString()
            );
            console.log('Current role ID : ' + this.roleId);

            var value = this.userExists(this.roleId);
            if (value == false) {
                this.router.navigateByUrl(currentPath);
            }
        }
        this.page1.pageNumber = this.requestParam.current;
        this.page1.size = this.requestParam.pasgesize;
    }
    userExists(id) {
        return this.roles.some(function (el) {
            return el.id === id;
        });
    }
    ngOnInit(): void {
        this.setPage(this.requestParam.current);
        //this.getList();
        /* this.search.nativeElement.valueChanges
    .debounceTime(1000)
    .subscribe(newValue => {this.requestParam.filter = newValue;this.setPage(this.getList)}); */
    }
    valueChange(newValue) {
        this.requestParam.filter = newValue;
        this.getList();
    }
    getList() {
        //this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getPatientList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                this.encryptedResponse = data;
                this.list = this.encryptedResponse.data.patientDetails;
                console.log(this.list);
                this.list.forEach((value) => {
                    if (value.city == '') {
                        value.city = '-';
                    }
                    value.totalTime =
                        value.totalTime == null ? 0 : value.totalTime;
                });
                this.serverResponse.next(this.list);
                //this.response = this.encryptedResponse.data.patientDetails;
                this.units = this.encryptedResponse.data.units;
                this.total = this.encryptedResponse.data.total;
                this.systemTotal = this.encryptedResponse.data.systemTotalvalue;
                this.active = this.encryptedResponse.data.active;
                this.inactive = this.encryptedResponse.data.inactive;
                this.page1.totalElements = this.total;
                this.page1.totalPages =
                    this.page1.totalElements / this.page1.size;
            },
            (error: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
                console.log(this.encryptedResponse);
            }
        );
    }
    filterChange(value, type) {
        console.log(this.requestParam);
        this.requestParam.current = 0;
        if (type == 'status') {
            if (value == 'active') {
                this.requestParam.status = '1';
            } else if (value == 'inactive') {
                this.requestParam.status = '0';
            } else {
                this.requestParam.status = '';
            }
            this.getList();
        } else if (type == 'type') {
            this.requestParam.type = value;
            this.requestParam.order.active = '';
            this.requestParam.order.direction = '';
            this.getList();
        } else if (type == 'bp') {
            this.requestParam.blood_pressure = value;
            this.getList();
        } else if (type == 'pulse') {
            this.requestParam.pulse = value;
            this.getList();
        } else if (type == 'search') {
            if (value.length >= 3) {
                this.requestParam.filter = value;
                this.getList();
            }
            if (value.length == 0) {
                this.requestParam.filter = value;
                this.getList();
            }
        }
        console.log(this.requestParam);
    }
    listViewChange(value) {
        console.log(value);
        if (value == 'grid-view') {
            this.addClass = 'grid-view';
        } else if (value == 'list') {
            this.addClass = 'list';
        }
    }
    onSort(event) {
        const sort = event.sorts[0];
        console.log('Sort Event', sort);
        this.sorting = sort;
        this.requestParam.order.active = sort.prop;
        this.requestParam.order.direction = sort.dir;
        this.page1.pageNumber = 0;
        this.getList();
    }
    get Math() {
        return Math;
    }

    setPage(pageInfo) {
        this.page1.pageNumber = pageInfo;
        console.log('ere');
        this.getList();
    }
    getServerData(event?: PageEvent) {
        console.log(event.pageIndex);
        console.log(event.pageSize);
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;
        console.log(this.requestParam);
        this.getList();
    }

    addPatient() {}
    setData(data) {
        console.log(data);
        var patientUuid = data.uuid;
        this.router.navigate(['admin/patient-detail'], {
            queryParams: { patientUuid: data.uuid },
        });
    }
    changeStatus(row) {
        console.log(row);
        this.alertPopup.title = 'Change Status';
        this.alertPopup.message = 'Are you sure want to change the status?';
        this.alertPopup.icon.show = true;
        this.alertPopup.icon.name = 'heroicons_outline:exclamation';
        this.alertPopup.icon.color = 'warn';
        this.alertPopup.actions.confirm.show = true;
        this.alertPopup.actions.confirm.label = 'Ok';
        this.alertPopup.actions.confirm.color = 'warn';
        this.alertPopup.actions.confirm.show = true;
        this.alertPopup.actions.cancel.show = true;
        this.alertPopup.actions.cancel.label = 'Cancel';
        this.alertPopup.dismissible = false;
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(this.alertPopup);
        let roleEncryption = localStorage.getItem('accessModifier');
        const role = this.encrypt.decryptData(roleEncryption).toString();
        let changeStatusRequest = {
            uuid: row.uuid,
            status: 0,
            role_id: role,
        };

        if (row.status == true) {
            changeStatusRequest.status = 1;
        } else {
            changeStatusRequest.status = 0;
        }
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            console.log(changeStatusRequest);
            if (result == 'confirmed') {
                const encryptedRequest = this.encrypt.encryptData(
                    JSON.stringify(changeStatusRequest)
                );
                this.service.changeStatus(encryptedRequest).subscribe(
                    (data: any) => {
                        console.log(data);
                        //this.getList();
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
            } else if (result == 'cancelled') {
                 console.log(this.list);
                // this.list.forEach((value: any) => {
                //     if (value.uuid === row.uuid) {
                //         console.log(row.status);
                //         console.log(value.status);
                //         value.status = row.status;
                //     }
                // });
                // this.serverResponse.next(this.list);
            }
            this.getList();
        });
    }

    exporttocsv() {
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.fileExport(encryptedRequest).subscribe(
            (data: any) => {
                this.downLoadFile(data);
            },
            (error: any) => {
                console.log(error);
                this.errorResponse = this.encrypt.decryptData(error.error.data);
                this.encryptedResponse = error.error.data;
            }
        );
    }
    recordsexporttocsv() {
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service
            .recordsfileExport(encryptedRequest)
            .pipe(first())
            .subscribe(
                (data: any) => {
                    /*console.log(data);
      return false;*/
                    this.downLoadFile(data);
                },
                (error: any) => {
                    console.log(error);
                    this.errorResponse = this.encrypt.decryptData(
                        error.error.data
                    );
                    this.encryptedResponse = error.error.data;
                }
            );
    }
    downLoadFile(data: any) {
        var blob = new Blob([data], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = url;
        // it forces the name of the downloaded file
        //var patient_id = 2222;
        fileLink.download =
            'Patient-List-' +
            moment.utc().local().format('MMM-DD-YY-LT') +
            '.csv';
        // document.body.setAttribute("style", "text-align:center");
        document.body.appendChild(fileLink);
        fileLink.click();
        //window.open(url);
    }
    //downLoadFile(data: any) {
    /*this.excelService.generateExcel();*/

    /*const blob = new Blob([data], { type: 'application/octet-stream' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);*/
    //}
}
