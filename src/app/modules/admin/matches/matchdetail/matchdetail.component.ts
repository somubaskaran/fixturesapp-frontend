import {
    Component,
    OnInit,
    ViewChild,
    TemplateRef,
    ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
import { successResponseData } from 'app/core/response-schema';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageEvent } from '@angular/material/paginator';
import {
    FormControl,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    NgForm,
} from '@angular/forms';
import * as moment from 'moment';
import 'moment-timezone';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatchService } from '../../match.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { retry } from 'rxjs/operators';
@Component({
    selector: 'app-matchdetail',
    templateUrl: './matchdetail.component.html',
    styleUrls: ['./matchdetail.component.scss'],
})
export class MatchdetailComponent implements OnInit {
    
    addPlayersForm: FormGroup;
    tournmentId = '';
    playersList : any;
    matchDetails : any;
    tourDetailsResponse : any;
    matchListArr : any;
    totalRounds : number = 4;
    tourRound : number;
    mactchesCountList = [];
    tourDetails: any;
    showData : boolean = false;
     todo = [[{"match_id":1,"player_name":'aaa'},{"match_id":1,"player_name":'bbb'}],[{"match_id":3,"player_name":'cccc'}],[{"match_id":4,"player_name":'dddd'}],[{"match_id":5,"player_name":'eeee'}],[{"match_id":6,"player_name":'ffff'}],[{"match_id":7,"player_name":'gggg'}],[{"match_id":8,"player_name":'hhhh'}],[{"match_id":9,"player_name":'iiii'}],[{"match_id":10,"player_name":'jjjj'}],[{"match_id":11,"player_name":'kkkk'}],[{"match_id":12,"player_name":'llll'}],[{"match_id":13,"player_name":'mmmm'}],[{"match_id":14,"player_name":'nnnn'}],[{"match_id":15,"player_name":'oooo'}],[{"match_id":16,"player_name":'pppp'}]];
     todo1 = [[{"match_id":9,"player_name":'iiii'}],[{"match_id":10,"player_name":'jjjj'}],[{"match_id":11,"player_name":'kkkk'}],[{"match_id":12,"player_name":'llll'}],[{"match_id":13,"player_name":'mmmm'}],[{"match_id":14,"player_name":'nnnn'}],[{"match_id":15,"player_name":'oooo'}],[{"match_id":16,"player_name":'pppp'}]];
    arr1: any[] = [];
    //todo : any[] = [{"match_id":1,"player_name":'aaa'},{"match_id":1,"player_name":'aaa'}];
    //todo: any[] = [["1","aaa"],["1","bbb"],["2","ccc"],["3","ddd"],["4","eee"],["5","fff"],["6","ggg"],["7","hhh"],["8","iii"],["9","jjj"],["10","kkk"],["11","lll"],["12","mmm"],["13","nnn"],["14","ooo"],["15","ppp"],["16","qqq"]];

    //todo = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog','Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog','Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog', 'Check e-mail']

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  public roundsList = [];
    @ViewChild('firstFormDialog') firstFormDialog: TemplateRef<any>;
    constructor(
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private matchservice: MatchService,
        private encrypt: EncryptDecryptService,
        private elements: MatDialog,
        private router: Router /*private excelService: ExcelService*/
    ) {
        
    }
    
    drop(event: CdkDragDrop<string[]>,value,matchDetails) {
        if(event.item.data.round_id=='1'){
            //console.log(event.item.data.round_id);
            //console.log('New match'+value);
            // console.log('length'+length);
            // console.log(matchDetails);
            if (event.previousContainer === event.container) {
                // console.log(event.container.data);
                // console.log(event.previousContainer.data);
                // console.log(event.previousIndex);
                // console.log(event.currentIndex);
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            } else {
                // console.log(event.container.data);
                // console.log(event.dropPoint);
                // console.log(event.previousIndex);
                // console.log(event.currentIndex);
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
            }
            // console.log("match count--/   "+this.mactchesCountList[0]);
            // console.log("from box----/    "+(Number(event.previousContainer.id)+1));
            // console.log("tooo box---/     "+value);
        
            var fromBox = (Number(event.previousContainer.id)+1);
            var toBox = value;
            var totalMatch = this.mactchesCountList[0];

            if(fromBox<=totalMatch && toBox<=totalMatch){
                console.log("Match to Match");
                this.updateMatchToMatch(event.item.data,value);
            }else if(fromBox>totalMatch && toBox>totalMatch){
                console.log("Bye to Bye");
                this.updateMatchToBye(event.item.data,value);
            }else if(fromBox<=totalMatch && toBox>totalMatch){
                console.log("Match to Bye");
                this.updateMatchToBye(event.item.data,value);
            }else if(fromBox>totalMatch && toBox<=totalMatch){
                console.log("Bye to Match");
                this.updateByeToMatch(event.item.data,value);
            }
        }
      }

    ngOnInit(): void {
        this.arr1.push(this.todo);
        this.arr1.push(this.todo1);
        console.log('arrrrrr');
        console.log(this.arr1);
        this.route.queryParams.subscribe((params) => {
            this.tournmentId = params['tournmentId'];
            this.getTournmentDetail(this.tournmentId);
            this.getPlayersList(this.tournmentId);
        });
        this.addPlayersForm = this._formBuilder.group({
            matchName: ['', Validators.required]
        });
    }
    ngAfterViewInit() {
    }
    changeMatch(fromData, toData){
        var requestParam = {
            matchOldData : fromData,
            matchUpdatedData : toData,
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(requestParam)
        );
        this.matchservice.getUpdatedMatchNumber(encryptedRequest).subscribe(
            (data: any) => {
               // this.getTournmentDetail(this.tournmentId);
        });
    }
    updateMatchToMatch(fromData,toData){
        var requestParam = {
            matchOldData : fromData,
            matchNewId : toData,
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(requestParam)
        );
        this.matchservice.updateMatchToMatch(encryptedRequest).subscribe(
            (data: any) => {
                this.getTournmentDetail(this.tournmentId);
        });
    }
    updateByeToMatch(fromData,toData){
        var requestParam = {
            matchOldData : fromData,
            matchNewId : toData,
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(requestParam)
        );
        this.matchservice.updateByeToMatch(encryptedRequest).subscribe(
            (data: any) => {
                this.getTournmentDetail(this.tournmentId);
        });
    }
    updateMatchToBye(fromData,toData){
        var requestParam = {
            matchOldData : fromData,
            matchNewId : toData,
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(requestParam)
        );
        this.matchservice.updateMatchToBye(encryptedRequest).subscribe(
            (data: any) => {
                this.getTournmentDetail(this.tournmentId);
        });
    }
    // updateByeMatch(fromData, toData){
    //     var requestParam = {
    //         matchOldData : fromData,
    //         matchUpdatedData : toData,
    //     }
    //     const encryptedRequest = this.encrypt.encryptData(
    //         JSON.stringify(requestParam)
    //     );
    //     this.matchservice.getupdateByeMatchNumber(encryptedRequest).subscribe(
    //         (data: any) => {
    //             this.getTournmentDetail(this.tournmentId);
    //     });
    // }
    goToNextRound(item) {
        var requestParam = {
            item : item,
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(requestParam)
        );
        this.matchservice.goToNextRound(encryptedRequest).subscribe(
            (data: any) => {
                this.getTournmentDetail(this.tournmentId);
        });
    }
    addPlayer() {
        let dialogRef = this.elements.open(this.firstFormDialog);
    }
    cancelPopup() {
        this.elements.closeAll();
    }
    getTournmentDetail(tournmentId){
        var requestParam = {
            tournmentId : tournmentId
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(requestParam)
        );
        this.matchservice.getTournmentDetail(encryptedRequest).subscribe(
            (data: any) => {
                //this.playersList = data.data;
                this.tourDetailsResponse = data.data;
                this.tourDetails = this.tourDetailsResponse.tournmentDetails;
                this.tourRound = this.tourDetailsResponse.tournmentDetails.tour_round;
                this.matchListArr = this.tourDetailsResponse.data
                this.totalRounds = this.tourDetailsResponse.totalRounds;
                this.mactchesCountList = this.tourDetailsResponse.mactchesCountList;
                var byeCount = this.tourDetailsResponse.byeCount;
                var tempArr = [];
                //this.numbers = Array(5).fill(0).map((x,i)=>i);
                // this.mactchesCountList.forEach(function(value,index){
                //     if(index===0){
                //         tempArr.push( Array(value+byeCount).fill(0).map((x,i)=>i));                   
                //     }else{
                //         tempArr.push( Array(value).fill(0).map((x,i)=>i));
                //     }
                //  })
                var temp = this.mactchesCountList[0];
                this.matchListArr.forEach(function(value,parentIndex){
                    value.forEach(function(data,index){
                        data.forEach(function(arr){
                            if(arr.played_status=='0'){
                                arr.disabled = false
                            }else{
                                arr.disabled = true;
                            }
                        });
                        if(parentIndex==0){
                            //console.log(this.tourDetailsResponse.mactchesCountList);
                            if(index<temp){
                                data.thisMatch = 'normal';
                            }else{
                                data.thisMatch = 'bye';
                            }
                        }else{
                            data.thisMatch = 'normal';
                        }
                    });
                });
                console.log(this.matchListArr);
                 if(this.matchListArr[0][0] != ''){
                    this.showData = true;
                 }
                this.roundsList = tempArr;
            }
        );    
    }
    getPlayersList(tournmentId){
        var requestParam = {
            tournmentId : tournmentId
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(requestParam)
        );
        this.matchservice.getPlayersList(encryptedRequest).subscribe(
            (data: any) => {
                this.playersList = data.data;
            }
        );    
    }
    onfirstFormSubmit() {
        if (this.addPlayersForm.valid) {
            var sendData = {
                playername : this.addPlayersForm.value.matchName,
                tournmentId : this.tournmentId,
                currentMatch : this.mactchesCountList[0]
            }
            const encryptedRequest = this.encrypt.encryptData(
                JSON.stringify(sendData)
            );
            this.matchservice.addPlayer(encryptedRequest).subscribe(
                (data: any) => {
                    this.elements.closeAll();
                    this.getPlayersList(this.tournmentId);
                    this.getTournmentDetail(this.tournmentId);
            },
            (error: any) => {
                
            });
        }
    }
    removeSpace(event, modelName) {

    }
    startMatch(){
        var sendData = {
            tournmentId : this.tournmentId,
            round_id: this.tourRound
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.matchservice.startMatch(encryptedRequest).subscribe(
            (data: any) => {
                this.elements.closeAll();
            this.getTournmentDetail(this.tournmentId);
        },
        (error: any) => {
            
        });
    }
    nextRound(){
        var sendData = {
            tournmentId : this.tournmentId,
            round_id: this.tourRound
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.matchservice.nextRound(encryptedRequest).subscribe(
            (data: any) => {
                this.elements.closeAll();
            this.getTournmentDetail(this.tournmentId);
        },
        (error: any) => {
            
        });
    }
    // getMatches(tournmentId){
    //     var requestParam = {
    //         tournmentId : tournmentId
    //     }
    //     const encryptedRequest = this.encrypt.encryptData(
    //         JSON.stringify(requestParam)
    //     );
    //     this.matchservice.getMatchDetail(encryptedRequest).subscribe(
    //         (data: any) => {
    //             //this.playersList = data.data;
    //         }
    //     );    
    // }
    playMatch(matchesList) {
        if(matchesList.length==2){
            if(matchesList[0].player_name!=null){
                // this.router.navigate(['/admin/matches/play-match'], {
                //     queryParams: { team_one: matchesList[0].match_id, team_two: matchesList[1].match_id },
                // });
                this.readyToPlayMatch(matchesList);
            }
        }
    }
    readyToPlayMatch(matchesList){
        var sendData = {
            matchesList : matchesList[0],
            courtNumber : '1',
        }
        const encryptedRequest = this.encrypt.encryptData(
            JSON.stringify(sendData)
        );
        this.matchservice.readyToPlayMatch(encryptedRequest).subscribe(
            (data: any) => {
                this.elements.closeAll();
            this.getTournmentDetail(this.tournmentId);
        },
        (error: any) => {
            
        });
    }
}