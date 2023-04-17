import { Component, ViewChild, ElementRef, Input, Output } from '@angular/core';
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
  @Input() data: any;
  @Input() config: any;
  @Output() selectedValues: any;

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedItems = [];
  selectAll: boolean;

  filteredOptions: Observable<any[]>;

  ngOnInit() {
    this.filteredOptions = this.searchTextboxControl.valueChanges.pipe(
      startWith<string>(''),
      map((name) => this._filter(name))
    );

    this.data = [
      { id: 1, name: 'Hotel Hangar' },
      { id: 2, name: 'Hotel Floph' },
      { id: 3, name: 'Novo Vernon Hotel' },
      { id: 4, name: 'Novo Vernon Resort' },
    ];

    this.config = {
      inputPlaceholder: 'Selecionar propriedade(s)',
      inputSearch: 'Buscar propriedades',
      notFound: 'Nenhuma propriedade encontrada',
      selectAllText: 'Selecionar todos',
    };

    if (this.data.length > 1)
      this.data.unshift({
        id: 0,
        name: this.config.selectAllText.toUpperCase(),
      });
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    this.selectFormControl.patchValue(this.selectedItems);
    let filteredList = this.data.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
    return name ? filteredList.filter((x) => x.id != 0) : filteredList;
  }

  getSelectedsInfo() {
    if (this.selectAll || this.selectedItems.length == this.data.length - 1)
      return 'Todos Selecionados';
    if (this.selectedItems.length == 1) return this.selectedItems[0].name;
    if (this.selectedItems.length >= 1)
      return `${this.selectedItems[0].name} +${this.selectedItems.length - 1}`;
  }

  selectionChange(event) {
    if (!event.isUserInput) return;

    let id = event.source.value.id;

    if (id == 0) {
      if (!this.selectAll) {
        this.selectAll = true;
        this.selectedItems = [];
        this.selectedItems.push(...this.data);
        this.skillSel.options.forEach((item) => item.select());
      } else {
        this.selectAll = false;
        this.selectedItems = [];
        this.skillSel.options.forEach((item) => {
          item.deselect();
        });
      }
      this.selectedValues = this.selectedItems.filter((x) => x.id != 0);
      return;
    }

    let indexList = this.selectedItems.indexOf(event.source.value);

    if (indexList == -1) this.selectedItems.push(event.source.value);
    else this.selectedItems.splice(indexList, 1);

    if (
      this.selectedItems.filter((x) => x.id != 0).length ==
      this.data.length - 1
    ) {
      this.selectAll = true;
      this.selectedItems.push(this.data[0]);

      if (this.skillSel.options.find((x) => x.value.id == 0) != null)
        this.skillSel.options.find((x) => x.value.id == 0).select();
    } else if (this.selectAll) {
      this.selectAll = false;
      let indexSelectAll = this.selectedItems.findIndex((x) => x.id == 0);

      if (indexSelectAll != -1) this.selectedItems.splice(indexSelectAll, 1);

      if (this.skillSel.options.find((x) => x.value.id == 0) != null)
        this.skillSel.options.find((x) => x.value.id == 0).deselect();
    }
    this.selectedValues = this.selectedItems.filter((x) => x.id != 0);
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

  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
