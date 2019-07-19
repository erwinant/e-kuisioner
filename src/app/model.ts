import { SafeHtml } from "@angular/platform-browser";

export class Answer {
    Id: number;
    Status: number=1;
    QCode: string="";
    Answer: string="";
    Username: string="";
}

export class Question {
    Id: number;
    Status: number=1;
    QCode: string;
    ParentQCode: string;
    OrderDesc: string="";
    QText: string="";
    CompanyCode: string;
    Answer:string="";
    FakeParentQCode:string="";
    QTextSanitizer: SafeHtml;
}

export class Company {
    Id: number;
    Status: number;
    CompanyCode:string;
    CompanyName:string;
}

export class User {
    Id: number;
    Status: number;
    Username:string;
    Password:string;
    LastLogin:string;
    CompanyCode:string;
    IsAdmin:number;
}
