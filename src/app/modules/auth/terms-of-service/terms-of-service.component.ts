import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent implements OnInit {
  selectedIndex:number;
  constructor(
    public matDialogRef: MatDialogRef<TermsOfServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    ) { }

  ngOnInit(): void {
    console.log(this._data);
    this.selectedIndex = this._data.page;
  }
  agree(){
    this._data = {'agree':true};
  }
  cancel(){
    this._data = {'agree':false};
  }

}
