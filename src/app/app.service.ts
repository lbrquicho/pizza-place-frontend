import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AppService {
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) {}

    getOrders(
        searchKey?: string,
        page: number = 1,
        pageSize: number = 10,
        orderBy: string = 'OrderDetailsId',
        order: string = 'asc'
    ): Observable<{ data: any[]; totalCount: number }> {
        let params = new HttpParams()
        .set('searchKey', searchKey ?? '')
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
        .set('orderBy', orderBy)
        .set('order', order);

        return this.http.get<{ data: any[]; totalCount: number }>(`${this.baseUrl}/Orders`, { params });
    }
}