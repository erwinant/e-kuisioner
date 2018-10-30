import { Component, OnInit } from '@angular/core';
import { Company, Question } from '../model';
import { XhrserviceService } from '../service/xhrservice.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  listCompany: Array<Company> = new Array<Company>();
  filteredCompany: Array<Company> = new Array<Company>();
  selectedCompany: string = "";

  listQuestion: Array<Question> = new Array<Question>();

  constructor(private xhrService: XhrserviceService) { }

  ngOnInit() {
    this.xhrService.getAllCompany().subscribe(r => {
      this.listCompany = r;
    });
  }

  onSearchChange(searchValue: string) {
    this.filteredCompany = this.listCompany.filter(f => f.CompanyName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
  }

  onSelectCompany(companyCode: string) {
    this.selectedCompany = companyCode;
    this.filteredCompany = new Array<Company>();
    this.xhrService.getAllQuestions(this.selectedCompany).subscribe(r => {
      this.listQuestion = r;
      this.isNumber("1");
    })
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

  saveQuestions() {
    
    let parentQCode: string = "";
    this.listQuestion.forEach(el => {
      
      if (!el.QCode) //add new
      {
        el.CompanyCode = this.selectedCompany;
        if (el.OrderDesc !== "" && this.isNumber(el.OrderDesc)) { //parent add
          setTimeout(() => {
            parentQCode = this.addParent(el);
          }, 2000);
        }

        if (el.OrderDesc !== "" && el.QText !== "") { //skip if all blank
          setTimeout(() => {
            el.ParentQCode = parentQCode;
            this.addChild(el);
          }, 2000);
        }
      } else { //update
        this.xhrService.putQuestion(el).subscribe(res =>{
          //console.log(res);
        });
      }
    })
  }

  addParent(el:Question):string{
    let parentQCode:string="";
    el.ParentQCode = "-";
    this.xhrService.postQuestion(el).subscribe(res =>{
      if (this.isNumber(res[0].OrderDesc)) {
        parentQCode = res[0].QCode;
      }
    });
    return parentQCode;
  }

  addChild(el:Question){
    this.xhrService.postQuestion(el).subscribe(res =>{
      
    });
  }

  

}
