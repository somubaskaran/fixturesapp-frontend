import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EncryptDecryptService } from 'app/core/encrypt-decrypt.service';
//import { MatchService } from '../../match.service';
import { Readytoplay } from '../../../readytoplay.service';
import { PointsService } from '../../../points.service';
import { map, filter, scan } from 'rxjs/operators';

@Component({
  selector: 'app-play-matches',
  templateUrl: './play-matches.component.html',
  styleUrls: ['./play-matches.component.scss']
})
export class PlayMatchesComponent implements OnInit {
  team_one: any;
  team_two: any;
  match_id_A: any;
  match_id_B: any;
  team_score_A: any;
  team_score_B: any;
  Status_team_A = false;
  Status_team_B = false;
  tour_id : any;
  readyToPlayId : any;
  constructor(
    private route: ActivatedRoute,
    private encrypt: EncryptDecryptService,
    private readytoplay: Readytoplay,
    private pointservice: PointsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.readyToPlayId = params['id'];

      this.getmatchInfo(this.readyToPlayId);
      //  this.team_one = params['team_one'];
      //  this.team_two = params['team_two'];
      //   this.getMatchDetails(this.team_one,'1');
      //   this.getMatchDetails(this.team_two,'2');
    });
  }
  getmatchInfo(readyToPlayId) {
    var sendData = {
      readyToPlayId : readyToPlayId,
    }
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(sendData)
    );
    this.readytoplay.getmatchInfo(encryptedRequest).subscribe(
        (data: any) => {
          // if(id==='1'){
          //   this.match_id_A = data.data[0];
          //   this.tour_id = data.data[0].tour_id;
          // }else if(id==='2') {
          //   this.match_id_B = data.data[0];
          //   this.tour_id = data.data[0].tour_id;
          // }
          this.team_one = data.data[0].match_id;
          this.match_id_A = data.data[0];
          this.team_two = data.data[1].match_id;
          this.match_id_B = data.data[1];
          this.getPoints(this.team_one,'1');
        this.getPoints(this.team_two,'2');
    },
    (error: any) => {
        
    });
  }
  getMatchDetails(matchId,id){
    var sendData = {
      matchId : matchId,
    }
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(sendData)
    );
    this.readytoplay.matchDetails(encryptedRequest).subscribe(
        (data: any) => {
          if(id==='1'){
            this.match_id_A = data.data[0];
            this.tour_id = data.data[0].tour_id;
          }else if(id==='2') {
            this.match_id_B = data.data[0];
            this.tour_id = data.data[0].tour_id;
          }
    },
    (error: any) => {
        
    });
  }
  getPoints(matchId,id){
    var sendData = {
      matchId : matchId,
    }
    
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(sendData)
    );
    this.pointservice.getPoints(encryptedRequest).subscribe(
        (data: any) => {
          if(id==='1'){
            this.team_score_A = data.data.point;
          }else if(id==='2') {
            this.team_score_B = data.data.point;
          }
    },
    (error: any) => {
        
    });
  }
  removePoint(matchDetails){
    var sendData = {
      matchId:matchDetails.match_id,
      teamId:matchDetails.team_id
    }
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(sendData)
    );
    this.pointservice.removePoints(encryptedRequest).subscribe(
        (data: any) => {
          this.getPoints(this.team_one,'1');
          this.getPoints(this.team_two,'2');
    },
    (error: any) => {
        
    });
  }
  addPoint(matchDetails){
    var sendData = {
      matchId:matchDetails.match_id,
      teamId:matchDetails.team_id
    }
    const encryptedRequest = this.encrypt.encryptData(
        JSON.stringify(sendData)
    );
    this.pointservice.addPoints(encryptedRequest).subscribe(
        (data: any) => {
          this.getPoints(this.team_one,'1');
          this.getPoints(this.team_two,'2');
    },
    (error: any) => {
        
    });
  }
  onStatusOne(event){
    if(event.checked===true){
      this.Status_team_B = false;
    }else{
      this.Status_team_B = true;    
    }
  }
  onStatusTwo(event){
    if(event.checked===true){
      this.Status_team_A = false;
    }else{
      this.Status_team_A = true;    
    }
  }
  finishMatch(){
    if(this.team_score_A != this.team_score_B){
      // if(this.Status_team_A===true){
      //   var sendData = {
      //     winnerId:this.team_one,
      //     looserId:this.team_two
      //   }
      // }else if(this.Status_team_B===true){
      //   var sendData = {
      //     winnerId:this.team_two,
      //     looserId:this.team_one
      //   }
      // }
      if(this.team_score_A>this.team_score_B){
        var sendData = {
              winnerId:this.team_one,
              looserId:this.team_two,
              readyToPlayId:this.readyToPlayId
            }
      }else{
        var sendData = {
              winnerId:this.team_two,
              looserId:this.team_one,
              readyToPlayId:this.readyToPlayId
            }
      }
      const encryptedRequest = this.encrypt.encryptData(
          JSON.stringify(sendData)
      );
      this.readytoplay.finishMatch(encryptedRequest).subscribe(
          (data: any) => {
          //   this.router.navigate(['admin/matches/detail'], {
          //     queryParams: { tournmentId: this.tour_id },
          // });
          this.router.navigate(['admin/readytoplay']);
      },
      (error: any) => {
          
      });

    }
  }
  backtoTour() {
    this.router.navigate(['admin/readytoplay']);
  }
}
