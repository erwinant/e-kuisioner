import { Component, OnInit } from '@angular/core';
import { Question } from '../model';
import { XhrserviceService } from '../service/xhrservice.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  listQuestion:Array<Question> = new Array<Question>();
  currentQuestion:Question = new Question();
  firstQ:boolean = false;
  lastQ:boolean = false;
  currentIndexQ:number = 0;
  username:string = "";
  openedDialog:boolean=false;
  constructor(private xhrService:XhrserviceService) { }

  ngOnInit() {
    let companyCode:any = localStorage.getItem("currentUserCompany");
    this.xhrService.getAllQuestions(companyCode).subscribe(r =>{
      this.username = localStorage.getItem("currentUser");
      this.listQuestion = r.filter(f => f.ParentQCode === "-");2
      this.currentQuestion = this.listQuestion[0];
      this.firstQ = true;
    });
  }

  receiveAction($event) {
    this.currentQuestion = new Question();
    if($event === 1){
      this.currentIndexQ--;
      this.lastQ =false;
      this.currentQuestion = this.listQuestion[this.currentIndexQ];
      if(this.listQuestion[this.currentIndexQ-1])
        this.currentQuestion = this.listQuestion[this.currentIndexQ];
      else
        this.firstQ = true;
    }
    
    if($event === 2){
      this.currentIndexQ++;
      this.firstQ =false;
      this.currentQuestion = this.listQuestion[this.currentIndexQ];
      if(this.listQuestion[this.currentIndexQ+1])
        this.currentQuestion = this.listQuestion[this.currentIndexQ];
      else
        this.lastQ = true;
    }

    if($event === 3){
      this.openedDialog = true;
      this.saveDone();
    }
  }

  saveDone(){
    localStorage.clear();
  }
}
