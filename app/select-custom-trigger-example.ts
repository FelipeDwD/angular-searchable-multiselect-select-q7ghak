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
    /**
     * Set filter event based on value changes 
     */
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
  }

  /**
   * Used to filter data based on search input 
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state 
    this.setSelectedValues();
    this.selectFormControl.patchValue(this.selectedValues);
    let filteredList = this.data.filter(option => option.name.toLowerCase().includes(filterValue) ||
    option.doc.toLowerCase().includes(filterValue));
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
    // Set search textbox value as empty while opening selectbox 
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   * Clearing search textbox value 
   */
  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  /**
   * Set selected values to retain the state 
   */
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
/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */