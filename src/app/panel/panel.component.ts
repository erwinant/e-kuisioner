import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Question, Answer } from '../model';
import { XhrserviceService } from '../service/xhrservice.service';
import { forkJoin } from 'rxjs';
import { join, leftJoin } from 'array-join';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, OnChanges {
  @Input() qsCode: string = "";
  qs: Array<Question> = new Array<Question>();
  an: Array<Answer> = new Array<Answer>();
  @Input() lastQ: boolean = false;
  @Input() firstQ: boolean = false;
  @Input() username: string = "";
  parentNumber: string = "";
  opened: boolean = false;
  message:string="";
  @Output() actionEvent = new EventEmitter<number>();
  constructor(private xhrService: XhrserviceService) { }

  ngOnInit() {

  }

  fetchData(qsCode: string, username: string) {
    let q = forkJoin(this.xhrService.getQuestion(qsCode),
      this.xhrService.getUserAnswers(username),
      this.xhrService.getQuestionChild(qsCode));
    q.subscribe(r => {
      if (r[2].length > 0) {
        this.parentNumber = r[0][0].OrderDesc;
        this.qs = leftJoin(r[2], r[1], { key: 'QCode' });
      }
      else {
        this.parentNumber = "";
        this.qs = leftJoin(r[0], r[1], { key: 'QCode' });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.qs = new Array<Question>();
    setTimeout(() => {
      this.fetchData(changes.qsCode.currentValue, this.username);
    }, 500);
  }

  sendAction(isNext: number) {
    console.log(this.qs);
    this.qs.forEach((el, idx) => {
      let answer: Answer = new Answer();
      answer.Answer = el.Answer;
      answer.QCode = el.QCode;
      answer.Status = 1;
      answer.Username = this.username;
      if (el.Answer) {
        if (el.Answer.length <= 30) {
          this.message = "Pengisian jawaban minimal 30 karakter.";
          setTimeout(() => {
            this.message = "";
          }, 2500);
          return;
        }
      }

      this.xhrService.getAnswer(el.QCode, this.username).subscribe(r => {
        if (r) //update
        {
          r.Answer = el.Answer;
          this.xhrService.putAnswer(r).subscribe(up => {

          });
        } else { //insert
          console.log(answer);
          this.xhrService.postAnswer(answer).subscribe(add => {

          });
        }
      })

      if (this.qs.length - 1 === idx) {
        this.actionEvent.emit(isNext);
      }
    })


  }

}
