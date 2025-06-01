import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AppActions from './app.actions';
import { AppService } from "../app.service";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";

@Injectable()
export class AppEffects {
  private actions$  = inject(Actions);
  private appService = inject(AppService);

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getOrders.type),
      switchMap((action: any) =>
        this.appService
          .getOrders(
            action.searchKey,  
            action.page != null ? action.page + 1 : 1,
            action.pageSize ?? 10,
            action.orderBy ?? 'orderDetailsId',
            action.order ?? 'asc'
          )
          .pipe(
            map((response) =>
              AppActions.getOrdersSuccess({
                data: response.data,
                totalCount: response.totalCount,
              })
            ),
            catchError((error) =>
              of(AppActions.getOrdersFailure({ error: error.message }))
            )
          )
      )
    )
  );
}