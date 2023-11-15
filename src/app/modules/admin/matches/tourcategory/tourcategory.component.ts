import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  Validators,
  NgForm,
} from '@angular/forms';
import { successResponseData } from 'app/core/response-schema';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { MatchService } from '../../match.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tourcategory',
  templateUrl: './tourcategory.component.html',
  styleUrls: ['./tourcategory.component.scss']
})

export class TourcategoryComponent implements OnInit {

  @ViewChild('firstFormDialog') firstFormDialog: TemplateRef<any>;
    firstForm: FormGroup;

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
  constructor(private encrypt: EncryptDecryptService, private matchservice: MatchService, private elements: MatDialog, ) { }

  ngOnInit(): void {
    this.setPage(this.requestParam.current);
  }

  getServerData(event?: PageEvent) {
    this.requestParam.current = event.pageIndex;
    this.requestParam.pasgesize = event.pageSize;    
    this.getList();
  }
  getList() {
    //this.spinner.show();
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(this.requestParam)
    );
    this.matchservice.getTournmentCategoryList(encryptedRequest).subscribe(
        (data: any) => {
            this.serverResponse.next(data.data);
        },
        (error: any) => {
            console.log(error);
            this.errorResponse = this.encrypt.decryptData(error.error.data);
            this.encryptedResponse = error.error.data;
            console.log(this.encryptedResponse);
        }
    );
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
  addPatient() {
    let dialogRef = this.elements.open(this.firstFormDialog);
  }
}

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