import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { DoctorService } from 'app/modules/doctor.service';
import { successResponseData } from 'app/core/response-schema';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-kitting-list',
    templateUrl: './kitting-list.component.html',
    styleUrls: ['./kitting-list.component.scss'],
})
export class KittingListComponent implements OnInit {
    roleId: number;
    roles = [
               {id: 2, name: 'Doctor Admin'},
               {id: 3, name: 'Doctor'},
               {id: 4, name: 'Finance'},
               {id: 5, name: 'Staff'},
            ];
    constructor(
        private service: DoctorService,
        private encrypt: EncryptDecryptService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
        let roleEncryption = localStorage.getItem('accessModifier');
          let currentPath = localStorage.getItem('path');
        if (roleEncryption != null) {
            this.roleId = Number(this.encrypt.decryptData(roleEncryption).toString());
            console.log('Current role ID : '+this.roleId);
            
            var value = this.userExists(this.roleId);
            if(value == false){
                this.router.navigateByUrl(currentPath);
            }
        }
        this.page1.pageNumber = this.requestParam.current;
        this.page1.size = this.requestParam.pasgesize;
    }
    userExists(id) {
      return this.roles.some(function(el) {
        return el.id === id;
      }); 
    }
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
        blood_pressure: string;
        pulse: string;
        order: { direction: string; active: string };
    } = {
        current: 0,
        pasgesize: 10,
        filter: '',
        status: '',
        type: 'desc',
        blood_pressure: '',
        pulse: '',
        order: { direction: '', active: '' },
    };

    ngOnInit(): void {
        //this.getList()
        this.setPage(this.requestParam.current);
        this.service.apicheck().subscribe((data: any) => {});
    }

    getList() {
        //this.spinner.show();
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(this.requestParam)
        );
        this.service.getKittingList(encryptedRequest).subscribe(
            (data: any) => {
                /*setTimeout(() => {
                    this.spinner.hide();
                }, 200);*/
                this.encryptedResponse = data;
                this.list = this.encryptedResponse.data.kittingDetails;
                this.list.forEach((value) => {
                    if (value.status == 0) {
                        value.status = 'Task Pending';
                    } else if (value.status == 1) {
                        value.status = 'Ordered';
                    } else if (value.status == 2) {
                        value.status = 'Processed';
                    } else if (value.status == 3) {
                        value.status = 'Shipped';
                    } else if (value.status == 4) {
                        value.status = 'Delivered';
                    }
                });
                console.log(this.list);
                this.serverResponse.next(this.list);
                this.response = this.encryptedResponse.data.patientDetails;
                this.total = this.encryptedResponse.data.total;
                this.page1.totalElements = this.total;
                this.page1.totalPages =
                    this.page1.totalElements / this.page1.size;
                this.list.forEach((value) => {
                    if (value.city == '') {
                        value.city = '-';
                    }
                });
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
    getServerData(event?: PageEvent) {
        console.log(event.pageIndex);
        console.log(event.previousPageIndex);
        this.requestParam.current = event.pageIndex;
        this.requestParam.pasgesize = event.pageSize;
        this.getList();
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
    setPage(pageInfo) {
        this.page1.pageNumber = pageInfo;
        this.getList();
    }
    listViewChange(value) {
        console.log(value);
        if (value == 'grid-view') {
            this.addClass = 'grid-view';
        } else if (value == 'list') {
            this.addClass = 'list';
        }
    }
    filterChange(value, type) {
        console.log(value);
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
            if (value.length >= 3 || value.length == 0) {
                this.requestParam.filter = value;
                this.getList();
            }    
        }
    }
}

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
