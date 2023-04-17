import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'select-custom-trigger-example',
  templateUrl: 'select-custom-trigger-example.html',
  styleUrls: ['select-custom-trigger-example.css'],
})

export class SelectCustomTriggerExample {

  @ViewChild('search') searchTextBox: ElementRef;
  @ViewChild('mySel') skillSel: MatSelect;

  config = {
    inputPlaceholder: 'Selecionar propriedade(s)',
    inputSearch: 'Buscar propriedades',
    notFound: 'Nenhuma propriedade encontrada'
  }

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues = [];
  selectAll: boolean
  data = [
    { id: 0, name: 'SELECIONAR TODAS' },
    { id: 1, name: 'Hotel Hangar' },
    { id: 2, name: 'Hotel Floph' },
    { id: 3, name: 'Novo Vernon Hotel' }
];

  filteredOptions: Observable<any[]>;

  ngOnInit() {    
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
  }
  
  private _filter(name: string){
    const filterValue = name.toLowerCase();    
    this.setSelectedValues();
    this.selectFormControl.patchValue(this.selectedValues);
    let filteredList = this.data.filter(option => option.name.toLowerCase().includes(filterValue));
    return filteredList;
  }

  getSelectedsInfo() {
    if (this.selectAll || this.selectedValues.length == this.data.length - 1)
        return 'Todos Selecionados';
    if (this.selectedValues.length == 1)
        return this.selectedValues[0].name;
    if (this.selectedValues.length >= 1)
        return `${this.selectedValues[0].name} +${this.selectedValues.length - 1}`;
}

 selectionChange(event) {
  if (!event.isUserInput)
      return;
  let id = event.source.value.id;
  if (id == 0) {
      if (!this.selectAll) {
          this.selectAll = true;
          this.selectedValues = [];
          this.selectedValues.push(...this.data.filter(x => x.id != 0));
          this.skillSel.options.forEach((item) => item.select());
      }
      else {
          this.selectAll = false;
          this.selectedValues = [];
          this.skillSel.options.forEach((item) => { item.deselect(); });
      }
      return;
  }
  let indexList = this.selectedValues.indexOf(event.source.value);
  if (indexList == -1)
      this.selectedValues.push(event.source.value);
  else
      this.selectedValues.splice(indexList, 1);
  if (this.selectedValues.filter(x => x.id != 0).length == this.data.length - 1) {
      this.skillSel.options.first.select();
      this.selectAll = true;
  }
  else {
      this.selectAll = false;
      this.skillSel.options.first.deselect();
  }
}

  openedChange(e) {    
    this.searchTextboxControl.patchValue('');    
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }
  
  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }
  
  setSelectedValues() {
    console.log('selectFormControl', this.selectFormControl.value);
    if (this.selectFormControl.value && this.selectFormControl.value.length > 0) {
      this.selectFormControl.value.forEach((e) => {
        if (this.selectedValues.indexOf(e) == -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }
}