import { Component, OnInit } from '@angular/core';
import { Company, Question } from '../model';
import { XhrserviceService } from '../service/xhrservice.service';
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as async from 'async';
import { templateJitUrl } from '@angular/compiler';
import { ExcelService } from '../service/excel.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  listCompany: Array<Company> = new Array<Company>();
  filteredCompany: Array<Company> = new Array<Company>();
  filteredCompanySource: Array<Company> = new Array<Company>();
  filteredCompanyTarget: Array<Company> = new Array<Company>();
  selectedCompany: string = "";
  selectedCompanySource: string = "";
  selectedCompanyTarget: string = "";
  lock: boolean = false;
  showSuccess: boolean = false;
  showError: boolean = false;
  copyMode: boolean = false;
  showCheckPerson: boolean = false;
  checkResult: string = "";
  copyError: string = "Existing data target will replace!";
  duplicateNumber: string = "";
  deleteConfirm: boolean = false;
  dataTobeDelete: Question = new Question();
  idxTobeDelete: number = undefined;
  currentUser: string = "";
  listQuestion: Array<Question> = new Array<Question>();
  reportSend: boolean = false;
  emailToExp: string = "";
  checkPersonMail: string = "";
  constructor(public excelService:ExcelService,private router: Router, private xhrService: XhrserviceService) { }

  ngOnInit() {
    this.xhrService.getUser(localStorage.getItem("currentUser")).subscribe(r => {
      if (r) {
        if (r.IsAdmin === 0) {
          this.router.navigate(['/landing']);
        }
      }
      this.currentUser = r.Username;
    });
    this.xhrService.getAllCompany().subscribe(r => {
      this.listCompany = r;
    });


  }

  onSearchChange(obj: string, searchValue: string) {
    if (obj === "1")
      this.filteredCompany = this.listCompany.filter(f => f.CompanyName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    if (obj === "2")
      this.filteredCompanySource = this.listCompany.filter(f => f.CompanyName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    if (obj === "3")
      this.filteredCompanyTarget = this.listCompany.filter(f => f.CompanyName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
  }

  orderParentKid(qs: Array<Question>): Array<Question> {

    let result: Array<Question> = new Array<Question>();
    if (qs.length == 0) return result;
    async.eachSeries(qs, (item, callback) => {
      console.log(item.OrderDesc);
      if (this.isNumber(item.OrderDesc)) {
        item.ParentQCode = "-";
        result.push(item);
        result = result.concat(qs.filter(f => f.ParentQCode === item.QCode));
        callback(null);
      } else {
        callback(null);
      }
    }, err => {

    });
    return result;
  }

  onSelectCompany(obj, companyCode: string) {
    if (obj === "1") {
      this.selectedCompany = companyCode;
      this.filteredCompany = new Array<Company>();
      this.xhrService.getAllQuestions(this.selectedCompany).subscribe(r => {

        this.listQuestion = this.orderParentKid(r);
        if (this.listQuestion.length === 0) {
          this.listQuestion.push(new Question());
        }
      });

    }

    if (obj === "2") {
      this.selectedCompanySource = companyCode;
      this.filteredCompanySource = new Array<Company>();
    }

    if (obj === "3") {
      this.selectedCompanyTarget = companyCode;
      this.filteredCompanyTarget = new Array<Company>();
    }
  }

  isNumber(character: string) {
    if (parseInt(character)) {
      return true;
    }
    return false;
  }

  addQuestion() {
    let qs: Question = new Question();
    this.listQuestion.push(qs);
  }

  checkDuplicate(qs: Array<Question>): boolean {
    return qs.some(el => {
      return this.listQuestion.filter(e => this.isNumber(e.OrderDesc)).filter(f => f.OrderDesc === el.OrderDesc).length > 1;
    })
  }

  checkPerson() {
    if (this.checkPersonMail == "") {
      return;
    }
    this.showCheckPerson = true;
    this.checkResult = "";
    this.xhrService.getCheckPerson(this.selectedCompany, this.checkPersonMail).subscribe(res => {
      if (res) {
        this.showCheckPerson = true;
        this.checkResult = "Uid: "+res.Username + " - Terjawab " + res.Terjawab + " dari "+ res.TotalSoal + " soal.";
        setTimeout(() => {
          this.checkResult = "";
          this.showCheckPerson = false;
        }, 5000);
      }

    });
  }
  viewPerson(){
    window.open('https://api-exkuisioner.experd.com/api/reportview/'+this.selectedCompany+'/'+this.checkPersonMail);
  }
  checkAll() {
    this.checkResult = "";
    this.showCheckPerson = true;
    let objData;
    this.xhrService.getCheckAll(this.selectedCompany).subscribe(res => {
      if (res) {
        objData = res;
        this.showCheckPerson = true;
        this.checkResult = "Excel sudah terdownload";
        setTimeout(() => {
          this.showCheckPerson = false;
        }, 5000);
      }

    },err=>{}
    ,()=>{
      this.excelService.exportAsExcelFile(objData,"export_raw");
    });
  }
  saveQuestions() {
    this.lock = true;
    if (this.checkDuplicate(this.listQuestion)) {
      this.lock = false;
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 2000);
      return;
    }

    this.xhrService.delAllQuestion(this.selectedCompany).subscribe(delall => {

      //process parent
      async.eachSeries(this.listQuestion, (item, callback) => {
        if (this.isNumber(item.OrderDesc)) {
          item.ParentQCode = "-";
          item.CompanyCode = this.selectedCompany;
          this.xhrService.postQuestion(item).subscribe(sub => {
            this.listQuestion.find(f => f.OrderDesc === sub.OrderDesc).QCode = sub.QCode;
          }, err => { },
            () => { callback(); });
        } else {
          callback();
        }
      }, (err) => {
        //process child
        let parentQCode: string = "";
        async.eachSeries(this.listQuestion, (itemC, callbackC) => {
          if (this.isNumber(itemC.OrderDesc)) {
            parentQCode = itemC.QCode;
            return callbackC();
          }
          itemC.ParentQCode = parentQCode;
          itemC.CompanyCode = this.selectedCompany;
          this.xhrService.postQuestion(itemC).subscribe(() => { }, errC => { }, () => { callbackC(); });
        }, err => {
          setTimeout(() => {
            setTimeout(() => {
              this.xhrService.getAllQuestions(this.selectedCompany).subscribe(r => {
                this.listQuestion = this.orderParentKid(r);
              });
            }, 500);
            this.lock = false;
            this.showSuccess = true;
            setTimeout(() => {
              this.showSuccess = false;
            }, 1000);
          }, 500);
        });
      });

    });
  }

  export() {
    this.xhrService.getReport(this.selectedCompany, this.currentUser).subscribe();
    setTimeout(() => {
      this.reportSend = false;
    }, 5000);
  }
  exportUser() {
    if (this.emailToExp == "") {
      return;
    }
    this.reportSend = true;
    this.xhrService.getReportUser(this.selectedCompany, this.currentUser, this.emailToExp).subscribe();
    setTimeout(() => {
      this.reportSend = false;

    }, 5000);
  }
  delCancel() {
    this.dataTobeDelete = new Question();
    this.deleteConfirm = false;
    this.idxTobeDelete = undefined;
  }

  delConfirm(qs: Question, idx: number) {
    this.dataTobeDelete = qs;
    this.deleteConfirm = true;
    this.idxTobeDelete = idx;
  }

  delQuestion() {
    let qs: any = this.dataTobeDelete;
    if (qs.QCode) {
      this.listQuestion = new Array<Question>();
      this.xhrService.getQuestionChild(qs.QCode).subscribe(c => {
        if (c.length) { //delete child if exist
          async.eachSeries(c, (item, callback) => {
            this.xhrService.delQuestion(item).subscribe(() => { }, err => { }, () => { callback(); });
          }, err => {
            this.xhrService.delQuestion(qs).subscribe();
            setTimeout(() => {
              this.xhrService.getAllQuestions(this.selectedCompany).subscribe(r => {
                this.listQuestion = this.orderParentKid(r);
              });
              this.deleteConfirm = false;
              this.dataTobeDelete = new Question();
            }, 200);
          });
        } else {
          this.xhrService.delQuestion(qs).subscribe();
          setTimeout(() => {
            this.xhrService.getAllQuestions(this.selectedCompany).subscribe(r => {
              this.listQuestion = this.orderParentKid(r);
            });
            this.deleteConfirm = false;
            this.dataTobeDelete = new Question();
          }, 200);
        }
      });
    }

    if (this.idxTobeDelete && !qs.QCode) {
      this.listQuestion.splice(this.idxTobeDelete, 1);
      this.deleteConfirm = false;
      this.dataTobeDelete = new Question();
      this.idxTobeDelete = undefined;
    }
  }

  copyData() {

    if (this.selectedCompanySource === this.selectedCompanyTarget) {
      this.copyError = "Source and destination cannot be the same!";
      return;
    }
    this.lock = true;
    let source: Array<Question> = new Array<Question>();
    this.xhrService.getAllQuestions(this.selectedCompanySource).subscribe(r => {
      source = this.orderParentKid(r);
      this.xhrService.delAllQuestion(this.selectedCompanyTarget).subscribe(delall => {
        //process parent
        async.eachSeries(source, (item, callback) => {
          if (this.isNumber(item.OrderDesc)) {
            item.ParentQCode = "-";
            item.CompanyCode = this.selectedCompanyTarget;
            this.xhrService.postQuestion(item).subscribe(sub => {
              source.find(f => f.OrderDesc === sub.OrderDesc).QCode = sub.QCode;
            }, err => { },
              () => { callback(); });
          } else {
            callback();
          }
        }, (err) => {
          //process child
          let parentQCode: string = "";
          async.eachSeries(source, (itemC, callbackC) => {
            if (this.isNumber(itemC.OrderDesc)) {
              parentQCode = itemC.QCode;
              return callbackC();
            }
            itemC.ParentQCode = parentQCode;
            itemC.CompanyCode = this.selectedCompanyTarget;
            this.xhrService.postQuestion(itemC).subscribe(() => { }, errC => { }, () => { callbackC(); });
          }, err => {
            setTimeout(() => {
              this.lock = false;
              this.showSuccess = true;
              this.copyMode = false;
              setTimeout(() => {
                this.showSuccess = false;
              }, 1000);
            }, 500);
          });
        });
      });
    });

  }
}
