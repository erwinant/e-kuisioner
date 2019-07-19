import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Question, Answer } from '../model';
import { XhrserviceService } from '../service/xhrservice.service';
import { forkJoin } from 'rxjs';
import { join, leftJoin } from 'array-join';
import { DomSanitizer } from '@angular/platform-browser';

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
  message: string = "";
  loading: number = 0;
  @Output() actionEvent = new EventEmitter<number>();
  constructor(private xhrService: XhrserviceService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loading = 1;
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
      this.qs.forEach(el => {
        el.QTextSanitizer = this.sanitizer.bypassSecurityTrustHtml(el.QText);
      })
      this.loading = 0;
    }, err => {
      this.loading = 0;
      alert("Koneksi Anda terputus, silakan refresh atau klik tombol F5");
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.qs = new Array<Question>();
    setTimeout(() => {

      this.fetchData(changes.qsCode.currentValue, this.username);
    }, 500);
  }

  sendAction(isNext: number) {
    for (let i = 0; i < this.qs.length; i++) {
      let answer: Answer = new Answer();
      answer.Answer = this.qs[i].Answer;
      answer.QCode = this.qs[i].QCode;
      answer.Status = 1;
      answer.Username = this.username;
      if (!this.qs[i].Answer) {
        this.message = "Mohon isi semua pertanyaan. Jika tidak memiliki pengalaman terkait pertanyaan tersebut, silakan ketik saja 'tidak ada'.";
        setTimeout(() => {
          this.message = "";
        }, 5500);
        return;
      }
      if (this.qs[i].Answer.length == 0) {
        this.message = "Mohon isi semua pertanyaan. Jika tidak memiliki pengalaman terkait pertanyaan tersebut, silakan ketik saja 'tidak ada'.";
        setTimeout(() => {
          this.message = "";
        }, 5500);
        return;
      }


      this.xhrService.getAnswer(this.qs[i].QCode, this.username).subscribe(r => {
        this.loading = 1;
        if (r) //update
        {
          r.Answer = answer.Answer;
          this.xhrService.putAnswer(r).subscribe(up => {
            setTimeout(() => {
              this.message = "";
            }, 100);
          }, err => {
            this.loading = 0;
            alert("Koneksi Anda terputus, silakan refresh atau klik tombol F5");
          });
        } else { //insert
          this.xhrService.postAnswer(answer).subscribe(add => {
            setTimeout(() => {
              this.message = "";
            }, 100);
          }, err => {
            this.loading = 0;
            alert("Koneksi Anda terputus, silakan refresh atau klik tombol F5");
          });
        }
      })

      if (this.qs.length - 1 === i) {
        this.actionEvent.emit(isNext);
      }
    }
    // this.qs.forEach((el, idx) => {
    //   let answer: Answer = new Answer();
    //   answer.Answer = el.Answer;
    //   answer.QCode = el.QCode;
    //   answer.Status = 1;
    //   answer.Username = this.username;
    //   if (el.Answer) {
    //     if (el.Answer.length <= 15) {
    //       this.message = "Pengisian jawaban minimal 15 karakter.";
    //       setTimeout(() => {
    //         this.message = "";
    //       }, 5500);
    //       return;
    //     }
    //   }

    //   this.xhrService.getAnswer(el.QCode, this.username).subscribe(r => {
    //     if (r) //update
    //     {
    //       r.Answer = el.Answer;
    //       this.xhrService.putAnswer(r).subscribe(up => {

    //       });
    //     } else { //insert
    //       this.xhrService.postAnswer(answer).subscribe(add => {

    //       });
    //     }
    //   })

    //   if (this.qs.length - 1 === idx) {
    //     this.actionEvent.emit(isNext);
    //   }
    // })


  }

}
