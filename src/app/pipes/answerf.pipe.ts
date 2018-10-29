import { Pipe, PipeTransform } from '@angular/core';
import { Answer } from '../model';

@Pipe({
  name: 'answerf'
})
export class AnswerfPipe implements PipeTransform {

  transform(value: Answer[], args?: any): any {

    return value.filter(f => f.QCode === args);
  }

}
