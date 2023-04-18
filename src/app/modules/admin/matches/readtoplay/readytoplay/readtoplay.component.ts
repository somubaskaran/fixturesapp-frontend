import { Component, OnInit } from '@angular/core';
import { Readytoplay } from '../../../readytoplay.service';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-readtoplay',
  templateUrl: './readtoplay.component.html',
  styleUrls: ['./readtoplay.component.scss']
})
export class ReadtoplayComponent implements OnInit {
  page1 = new patientListPageData();
  serverResponse = new BehaviorSubject<any[]>([]);
  constructor(
    private encrypt: EncryptDecryptService, private readytoplay : Readytoplay, private router: Router) { }

  ngOnInit(): void {
    this.getReadyToPlayList();
  }
  getReadyToPlayList(){
    var requestParam = {
    }
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(requestParam)
    );
    this.readytoplay.getMatchList(encryptedRequest).subscribe(
        (data: any) => {
          var resultData = data.data;
          resultData.forEach(element => {
            if(element.status==0){
              element.statusText = "ready to play";
            }else{
              element.statusText = "played successfully";
            }
          });
          this.serverResponse.next(resultData);
    });
  }

  onSort(event) {
  }
  setPage(pageInfo) {
      // this.page1.pageNumber = pageInfo;
      // this.getList();
  }
  goToMatch(rowData){
    console.log(rowData);
    // this.router.navigate(['/admin/matches/play-match'], {
    //     queryParams: { tour_id: rowData.tour_id,round_id : rowData.round_id ,match_number : rowData.match_number, court_number : rowData.court_number },
    // });
    this.router.navigate(['/admin/readytoplay/play-match'], {
          queryParams: { id: rowData.id},
      });
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