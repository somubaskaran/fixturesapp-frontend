import { Component, OnInit ,ViewChild, TemplateRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  ActivatedRoute,Router } from '@angular/router';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { AdminService } from '../../admin.service';
import { successResponseData } from 'app/core/response-schema';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-patientdetail',
  templateUrl: './patientdetail.component.html',
  styleUrls: ['./patientdetail.component.scss']
})
export class PatientdetailComponent implements OnInit {
  firstForm: FormGroup;
  @ViewChild("updatePatient") updatePatientDialog: TemplateRef<any>;
  @ViewChild("manageLogpopup") manageLog: TemplateRef<any>;
  @ViewChild("manualLogpopup") manualLogPop: TemplateRef<any>;


  constructor(private elements: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private encrypt: EncryptDecryptService,
              private service: AdminService,
              private _formBuilder: FormBuilder,) { }
  patientUuid : string;
  patientDetailData : any;
  encryptedResponse: successResponseData;
  errorResponse: successResponseData;

  first_name : string = '';
  last_name : string = '';
  Gender : string = '';
  DOB : string = '';
  Age : number;
  MRN : string;
  MobileNumber : number;
  Status : string = '';
  City : string = '';
  stateList: string[];
  fromState: any;
  shippingAddressModel = true;
  shippState: any;
  tab : string = 'basicInfo';
  photo: File;
  created_at: string;
  deviceType : string;
  selectGender : any = 1;
  kitorderdate: string;
  orderprocesseddate: string;
  ordershippeddate: string;
  preferredLanguageList = [
    { "name": "English","checked": false,"value":1},
    { "name": "Spanish","checked": true,"value":0}
  ];
  ngOnInit(): void {
    this.getStates();
    this.firstForm = this._formBuilder.group({
        firstName: ['',Validators.required],
        lastName: ['',Validators.required],
        dateOfBirth: ['',Validators.required],
        email: ['',[ Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        homeNumber: ['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
        addressline1: ['',Validators.required],
      addressline2: ['',Validators.required],
      city: ['',Validators.required],
      state: ['',Validators.required],
      zip: ['',Validators.required],
      shippingAddress: [''],
      shippingaddressline1: [''],
      shippingaddressline2: [''],
      shippingcity: [''],
      shippingstate: [''],
      shippingzip: [''],
      /*kitorderdate: [''],
      orderprocesseddate: [''],
      ordershippeddate: [''],*/
      icdcode: [''],
      gender:[''],
      preferredLanguage: [''],
      sevendays: [''],
      tenreadings: ['']
    });
    this.getPatientData();
  }
  getPatientData(){
    this.route.queryParams.subscribe(params => {
      this.patientUuid = params['patientUuid'];
      /*var datas = { 
        patientUuid : this.patientUuid
      };*/
      const encryptedRequest = this.encrypt.encryptData(JSON.stringify(this.patientUuid));
      this.service.getPatientDetail(encryptedRequest).subscribe((data: any) => { 
      this.patientDetailData = data.data[0];
      console.log(this.patientDetailData);
      this.first_name = this.patientDetailData.first_name;
      this.last_name = this.patientDetailData.last_name;
      this.Gender = this.patientDetailData.gender;
      this.MRN = this.patientDetailData.patient_id;
      this.DOB = moment(this.patientDetailData.date).format('MMM DD,YYYY');
      this.Age = this.patientDetailData.age;
      this.Status = this.patientDetailData.status;
      this.MobileNumber = this.patientDetailData.mobile_phone;
      this.City = this.patientDetailData.city;
      this.created_at = moment(this.patientDetailData.created_at).format('MMM DD,YYYY');
      this.preferredLanguageList.forEach((value) => {
        console.log(value.value);
        if(value.value==this.patientDetailData.language){
          value.checked = true;
        }else{
          value.checked = false;
        }
      });
      /*aa.forEach((value) => {
        console.log(value);
        return false;
      if(value.date!=null){
          value.date = value.date.format("MMM DD,YYYY");
      }
    });*/
        /*this.firstForm.patchValue({
          firstName : 'aa',
        });*/
      this.firstForm.controls['firstName'].setValue(this.patientDetailData.first_name);
      this.firstForm.controls['lastName'].setValue(this.patientDetailData.last_name);
      this.firstForm.controls['dateOfBirth'].setValue(this.patientDetailData.date);
      this.firstForm.controls['email'].setValue(this.patientDetailData.patient_email);
      this.firstForm.controls['mobileNumber'].setValue(this.patientDetailData.mobile_phone);
      this.firstForm.controls['homeNumber'].setValue(this.patientDetailData.home_phone);
      this.firstForm.controls['addressline1'].setValue(this.patientDetailData.address_line_1);
      this.firstForm.controls['addressline2'].setValue(this.patientDetailData.address_line_2);
      this.firstForm.controls['city'].setValue(this.patientDetailData.city);
      this.fromState = Number( this.patientDetailData.state );
      this.firstForm.controls['zip'].setValue(this.patientDetailData.zip);
      this.selectGender = this.patientDetailData.genderValue;
      this.firstForm.controls['shippingaddressline1'].setValue(this.patientDetailData.shipping_address_line1);
      this.firstForm.controls['shippingaddressline2'].setValue(this.patientDetailData.shipping_address_line2);
      this.firstForm.controls['shippingcity'].setValue(this.patientDetailData.shipping_city);
      this.shippState = Number( this.patientDetailData.shipping_state );
      this.firstForm.controls['shippingzip'].setValue(this.patientDetailData.shipping_zip);
      this.imgURL = this.patientDetailData.patient_image;
      this.kitorderdate = (this.patientDetailData.order_received_date =='' || this.patientDetailData.order_received_date ==null ?'-':moment.unix(this.patientDetailData.order_received_date).format('MMM DD,YYYY'));
      this.orderprocesseddate = (this.patientDetailData.order_processed_date =='' || this.patientDetailData.order_processed_date ==null ?'-':moment.unix(this.patientDetailData.order_processed_date).format('MMM DD,YYYY'));
      this.ordershippeddate = (this.patientDetailData.order_shipping_date =='' || this.patientDetailData.order_shipping_date ==null ?'-':moment.unix(this.patientDetailData.order_shipping_date).format('MMM DD,YYYY'));
      if(this.imgURL) {
          this.defaultimg = false;
        } else {
          this.defaultimg = true;
        }
        this.deviceType = this.patientDetailData.device_name;
        this.firstForm.controls['preferredLanguage'].setValue(this.patientDetailData.language);
        var sevendays = (this.patientDetailData.sevendays==1?true:false);
        var tenreadings = (this.patientDetailData.tenreadings==1?true:false);
        this.firstForm.controls['sevendays'].setValue(sevendays);
        this.firstForm.controls['tenreadings'].setValue(tenreadings);
    },
      (error: any) => {
        console.log(error);
        this.errorResponse = this.encrypt.decryptData(error.error.data);
        this.encryptedResponse = error.error.data;
        console.log(this.encryptedResponse);
      });
    });
  }
  getStates() {
    this.service.getStates().subscribe((data: any) => {
      console.log(data);
      this.stateList = data.data;
    },
      (error: any) => {
        console.log(error);
      });
  }
  onUpdatePatient() {
    let dialogRef = this.elements.open(this.updatePatientDialog,{
      width:'680px'
    });
    this.tab = 'basicInfo';
  }

  onBackPatient(){
    this.router.navigate(['/admin/patient/list']);
  }
  manageTime(){
    let dialogRef = this.elements.open(this.manageLog,{
      width: '810px'
    });
  }
  manualLog(){
    let dialogRef = this.elements.open(this.manualLogPop,{
      width: '640px'
    });
  }
  radioSelectChange(event,listName){
    console.log(event);
    listName.forEach((value) => {
      if(value.name==event.name){
          value.checked = true;
      }else{
          value.checked = false;
      }
    });
  }
  cancelPopup(){
    this.elements.closeAll();
    //this.firstForm.reset();
    return false;
  }
  modelFirstName : string;
  modelLastName : string;
  modelMrn : string;
  modelIcd : string = "ICD-10";
  modelAddressLine1: string;
  modelAddressLine2: string;
  modelCity: string;
  modelZip: string;
  modelShippingAddressLine1: string;
  modelShippingAddressLine2: string;
  modelShippingCity: string;
  modelShippingZip: string;
  removeSpace(event,modelName){
    if(modelName=='modelFirstName'){
      this.modelFirstName = event.trim();
    }
    if(modelName=='modelLastName'){
      this.modelLastName = event.trim();
    }
    if(modelName=='modelMrn'){
      this.modelMrn = event.trim();
    }
    if(modelName=='modelIcd'){
      this.modelIcd = event.trim();
    }
    if(modelName=='modelAddressLine1'){
      this.modelAddressLine1 = event.trim();
    }
    if(modelName=='modelAddressLine2'){
      this.modelAddressLine2 = event.trim();
    }
    if(modelName=='modelCity'){
      this.modelCity = event.trim();
    }
    if(modelName=='modelZip'){
      this.modelZip = event.trim();
    }
    if(modelName=='modelShippingAddressLine1'){
      this.modelShippingAddressLine1 = event.trim();
    }
    if(modelName=='modelShippingAddressLine2'){
      this.modelShippingAddressLine2 = event.trim();
    }
    if(modelName=='modelShippingCity'){
      this.modelShippingCity = event.trim();
    }
    if(modelName=='modelShippingZip'){
      this.modelShippingZip = event.trim();
    }
  }
  shippingAddressChange(event){
    console.log(event.checked);
    this.shippingAddressModel = event.checked;
    if(event.checked==false){
      this.firstForm.get('shippingaddressline1').setValidators([Validators.required]);
       this.firstForm.get('shippingaddressline1').updateValueAndValidity();
       this.firstForm.get('shippingaddressline2').setValidators([Validators.required]);
       this.firstForm.get('shippingaddressline2').updateValueAndValidity();
       this.firstForm.get('shippingcity').setValidators([Validators.required]);
       this.firstForm.get('shippingcity').updateValueAndValidity();
       this.firstForm.get('shippingstate').setValidators([Validators.required]);
       this.firstForm.get('shippingstate').updateValueAndValidity();
       this.firstForm.get('shippingzip').setValidators([Validators.required]);
       this.firstForm.get('shippingzip').updateValueAndValidity();
    }else{
      this.firstForm.get('shippingaddressline1').clearValidators();
      this.firstForm.get('shippingaddressline1').updateValueAndValidity();
      this.firstForm.get('shippingaddressline2').clearValidators();
      this.firstForm.get('shippingaddressline2').updateValueAndValidity();
      this.firstForm.get('shippingcity').clearValidators();
      this.firstForm.get('shippingcity').updateValueAndValidity();
      this.firstForm.get('shippingstate').clearValidators();
      this.firstForm.get('shippingstate').updateValueAndValidity();
      this.firstForm.get('shippingzip').clearValidators();
      this.firstForm.get('shippingzip').updateValueAndValidity();
    }
  }
  
  onValChange(value){
       console.log(value);
       if(value == 0){
         this.tab = 'basicInfo';
       }else if(value == 1){
         this.tab = 'deviceInfo';
       }else if(value == 2){
         this.tab = 'icdcode';
       }
  }
  onfirstFormSubmit(){
    /*var sendData = {
          "patientUuid": this.patientUuid,
          "firstName": this.firstForm.value.firstName,
          "lastName": this.firstForm.value.lastName,
          "dateOfBirth": moment(this.firstForm.value.dateOfBirth).format("YYYY-MM-DD"),
          "email": this.firstForm.value.email,
          "mobileNumber": this.firstForm.value.mobileNumber,
          "homeNumber": this.firstForm.value.homeNumber,
          "addressline1": this.firstForm.value.addressline1,
          "addressline2": this.firstForm.value.addressline2,
          "city" : this.firstForm.value.city,
          "state" : this.firstForm.value.state,
          "zip" : this.firstForm.value.zip,
          "shippingAddress" : (this.firstForm.value.shippingAddress==true?'1':'0'),
          "shippingaddressline1" : this.firstForm.value.shippingaddressline1,
          "shippingaddressline2" : this.firstForm.value.shippingaddressline2,
          "shippingcity" : this.firstForm.value.shippingcity,
          "shippingstate" : this.firstForm.value.shippingstate,
          "shippingzip" : this.firstForm.value.shippingzip,
      };
      console.log(sendData);*/
      const formData = new FormData();
      if (this.firstForm.valid) {
        formData.append('patientUuid',this.patientUuid);
        formData.append('firstName',this.firstForm.value.firstName);
        formData.append('lastName',this.firstForm.value.lastName);
        formData.append('dateOfBirth',moment(this.firstForm.value.dateOfBirth).format("YYYY-MM-DD"));
        formData.append('mobileNumber',this.firstForm.value.homeNumber);
        formData.append('homeNumber',this.firstForm.value.homeNumber);
        formData.append('email',this.firstForm.value.email);
        formData.append('addressline1',this.firstForm.value.addressline1);
        formData.append('addressline2',this.firstForm.value.addressline2);
        formData.append('city',this.firstForm.value.city);
        formData.append('state',this.firstForm.value.state);
        formData.append('zip',this.firstForm.value.zip);
        formData.append('shippingAddress',(this.firstForm.value.shippingAddress==true?'1':'0'));
        formData.append('shippingaddressline1',this.firstForm.value.shippingaddressline1);
        formData.append('shippingaddressline2',this.firstForm.value.shippingaddressline2);
        formData.append('shippingcity',this.firstForm.value.shippingcity);
        formData.append('shippingstate',this.firstForm.value.shippingstate);
        formData.append('shippingzip',this.firstForm.value.shippingzip);
        formData.append('photo',this.photo);
        /*var order_received_date = (this.firstForm.value.kitorderdate == null ? '': moment(this.firstForm.value.kitorderdate).format("YYYY-MM-DD"));
        formData.append('order_received_date',order_received_date);
        var order_processed_date = (this.firstForm.value.orderprocesseddate == null ? '': moment(this.firstForm.value.orderprocesseddate).format("YYYY-MM-DD"));
        formData.append('order_processed_date',order_processed_date);
        var order_shipping_date = (this.firstForm.value.ordershippeddate == null ? '': moment(this.firstForm.value.orderprocesseddate).format("YYYY-MM-DD"));
        formData.append('order_shipping_date',order_shipping_date);*/
        formData.append('icdcode',this.firstForm.value.icdcode);
        formData.append('gender', this.firstForm.value.gender);
        var preferredLanguage = (this.firstForm.value.preferredLanguage==1?'1':'0');
        formData.append('preferredLanguage', preferredLanguage);
        var sevendays = (this.firstForm.value.sevendays==true?'1':'0');
        var tenreadings = (this.firstForm.value.tenreadings==true?'1':'0');
        formData.append('sevendays',sevendays);
        formData.append('tenreadings',tenreadings);
      //const encryptedRequest = this.encrypt.encryptData(JSON.stringify(formData));
        this.service.updatePatient(formData).subscribe((data: any) => {
          var successResponse = this.encrypt.decryptData(data.data);
            console.log(successResponse);
            this.getPatientData();
            this.elements.closeAll();
        },
        (error: any) => {
          console.log(error);
          this.errorResponse = this.encrypt.decryptData(error.error.data);
            /*setTimeout(()=>{                           // <<<---using ()=> syntax
                  this.Message='Email and Mobile Number are Unique';
                  this.MessageClass = 'error';
              }, 6000);*/
              /*this.elements.closeAll();
              let dialogRef = this.elements.open(this.firstFormDialog);
              this.backform = 0;
              this.emailError = 'Email and Mobile Number are Unique';*/
        });
      }    
  }
  imgURL: any;
  defaultimg : boolean = true;
  onSelect(event) {
    /*console.log(files);
    this.file = files.item(0);
    this.image_preview = this.file.name;*/
    const file = event.target.files[0];
      if(file.type == "image/png" || file.type == "image/jpeg"){
        this.photo = file;
      } else {
        return false;
      }
      var reader = new FileReader();
      //this.imagePath = event.target.files;
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
        if(this.imgURL) {
          this.defaultimg = false;
          console.log(this.defaultimg);
        } else {
          this.defaultimg = true;
        }
      }


    }
}
