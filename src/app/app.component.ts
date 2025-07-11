import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getOrders } from './store/app.actions';
import { Observable, takeUntil } from 'rxjs';
import { selectOrdersData, selectOrdersLoading, selectOrdersTotalCount } from './store/app.selectors';
import { AppService } from './app.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatInputModule, CommonModule, FormsModule, NgChartsModule, MatProgressSpinnerModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private store = inject(Store);
  isLoading$: Observable<boolean> = this.store.select(selectOrdersLoading)
  
  columnItems = [
    {headRef: 'orderDetailsId', name: 'ID', sortable: true, isChecked: true, isDisabled: false},
    // {headRef: 'orderId', name: 'orderId', isChecked: true, isDisabled: false},
    // {headRef: 'pizzaId', name: 'pizzaId', isChecked: true, isDisabled: false},
    // {headRef: 'pizzaTypeId', name: 'pizzaTypeId', isChecked: true, isDisabled: false},
    {headRef: 'name', name: 'Name', sortable: true, isChecked: true, isDisabled: false},
    {headRef: 'category', name: 'Category', sortable: true, isChecked: true, isDisabled: false},
    {headRef: 'ingredients', name: 'Ingredients', sortable: false, isChecked: true, isDisabled: false},
    {headRef: 'date', name: 'Date', sortable: true, isChecked: true, isDisabled: false},
    {headRef: 'time', name: 'Time', sortable: false, isChecked: true, isDisabled: false},
    {headRef: 'size', name: 'Size', sortable: true, isChecked: true, isDisabled: false},
    {headRef: 'price', name: 'Price', sortable: true, isChecked: true, isDisabled: false},
    {headRef: 'quantity', name: 'Quantity', sortable: true, isChecked: true, isDisabled: false},
  ]

  displayedColumns: string[] = this.columnItems.map(item => item.headRef);

  columnSelect: string[] = this.columnItems.filter(item => item.isChecked).map(item => item.headRef);

  dataSource = new MatTableDataSource<any>([]);

  pieChartLabels: string[] = [];
  pieChartType: 'pie' = 'pie';
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  page = 0
  pageSize = 10
  order: 'asc' | 'desc' = 'asc'
  orderBy: string = 'orderDetailsId'
  searchKey: string = ''

  totalCount = 0


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    
  }

  ngOnInit(): void {
    
    this.loadOrders();

    this.store.pipe(select(selectOrdersData)).subscribe((data: any[]) => {
      this.dataSource.data = data;

      const categoryCountMap = new Map<string, number>();

      data.forEach(item => {
        const category = item.category ?? 'Unknown';
        categoryCountMap.set(category, (categoryCountMap.get(category) || 0) + 1);
      });

      const labels = Array.from(categoryCountMap.keys());
      const counts = Array.from(categoryCountMap.values());
      const backgroundColors = this.generateRandomColors(labels.length);

      this.pieChartLabels = labels;
      this.pieChartData = {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }
        ]
      };

      //console.log('Orders Data:', this.dataSource.data);
    });

    this.store.pipe(select(selectOrdersTotalCount)).subscribe((total: number) => {
      this.totalCount = total || 0;

      //console.log("Total Orders:", this.totalCount);
    });
  }

  loadOrders() {
    this.store.dispatch(getOrders({
      searchKey: this.searchKey,
      page: this.page,
      pageSize: this.pageSize,
      order: this.order,
      orderBy: this.orderBy
    }))
  }

  onSortChange(sort: Sort): void {
    if (sort.direction === '') {
      this.order = 'asc'
      this.orderBy = 'OrderDetailsId'
    }
    else {
      this.order = sort.direction as 'asc' | 'desc';
      this.orderBy = sort.active
    }

    this.page = 0
    this.loadOrders();
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  applyFilter(event: Event) {
    this.searchKey = (event.target as HTMLInputElement).value;
    this.page = 0
    this.loadOrders();
  }

  // updateColumnsToDisplay(index: number) {
  //   if (this.columnItems.filter(item => item.isChecked).length < 1) {
  //     this.columnItems[index].isChecked = true;
  //   }
  //   else {
  //     this.columnSelect = this.columnItems.filter(item => item.isChecked).map(item => item.headRef);
  //   }
  // }

  private generateRandomColors(count: number): string[] {
    const usedColors = new Set<string>();
    const colors: string[] = [];

    while (colors.length < count) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      if (!usedColors.has(color)) {
        usedColors.add(color);
        colors.push(color);
      }
    }

    return colors;
  }

}
