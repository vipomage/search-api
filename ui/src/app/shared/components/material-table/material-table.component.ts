import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

interface UserModel {
  recordId: number;
  name: string;
  project: string;
  company: string;
  role: string;
}

interface PaginationModel<T> {
  items: T[];
  total: number;
  pageSize: number;
  currentPage: number;
  pages: number;
}

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss'],
})
export class MaterialTableComponent implements AfterViewInit {
  fb: FormBuilder = new FormBuilder();
  displayedColumns: string[] = [
    'recordId',
    'name',
    'company',
    'project',
    'role',
  ];
  dataSource!: MatTableDataSource<any>;

  queryFormControl: FormControl = this.fb.control('');

  constructor(private http: HttpClient) {}

  async ngAfterViewInit(): Promise<void> {
    this.refreshData('');

    this.queryFormControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(this.refreshData.bind(this));
  }

  async refreshData(query: string = ''): Promise<void> {
    if (query.match('[A-z ,|\\-()]+&PageSize=\\d+&PageIndex=\\d+')) {
      const { items } = await this.http
        .get<PaginationModel<UserModel>>(
          `http://localhost:3000/api/user/query=${query}`
        )
        .toPromise();
      this.dataSource = new MatTableDataSource<any>(items);
    } else {
      const res: UserModel[] = await this.http
        .get<UserModel[]>(`http://localhost:3000/api/user/query=${query}`)
        .toPromise();
      this.dataSource = new MatTableDataSource<any>(res);
    }
  }
}
