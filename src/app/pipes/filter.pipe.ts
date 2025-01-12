import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filterField: string, filterValue: any): any[] {
    if (!items || !filterField || filterValue === undefined) {
      return items;
    }
    return items.filter(item => item[filterField] !== filterValue);
  }
}
