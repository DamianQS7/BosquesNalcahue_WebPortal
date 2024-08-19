import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSpecies',
  standalone: true
})
export class FormatSpeciesPipe implements PipeTransform {

  transform(value: string[] | null): string | null {
    if(value === null) return null;

    return value.join(', ');
  }

}
