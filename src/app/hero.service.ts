import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from "@angular/forms";



import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private heroesUrl = 'https://violin-pro.firebaseio.com/items/';  // URL to web api
  


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private messageService: MessageService) { }

    form = new FormGroup({        
      customerName: new FormControl(''),
      orderNumber: new FormControl(''),
      coffeeOrder: new FormControl(''), 
      completed: new FormControl(false)
  })

  /** GET heroes from the server */
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

/**GET CoffeeOrders */
  getCoffeeOrders() { 
    return this.firestore.collection("coffeeOrders").snapshotChanges();
  }



/** GET hero by id. Will 404 if id not found */
getHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${name}`;
  return this.http.get<Hero>(url).pipe(
    tap(_ => this.log(`fetched hero id=${name}`)),
    catchError(this.handleError<Hero>(`getHero id=${name}`))
  );
}

    /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

/** PUT: update the hero on the server */
updateHero (hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}

/**Add coffee app */
createCoffeeOrder(data) {
  return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("coffeeOrders")
          .add(data)
          .then(res => {}, err => reject(err));
  });
}

updateCoffeeOrder(data) {
  return this.firestore
      .collection("coffeeOrders")
      .doc(data.payload.doc.id)
      .set({ completed: true, customerName: 'updated'}, { merge: true });
}


/** POST: add a new hero to the server */
addHero(hero: Hero) {
  return new Promise<any>((resolve, reject) => {
    this.firestore
      .collection('heroes')
      .add(hero)
      .then(
        res => {},
        err => reject(err)
      );
  });
}

/** POST: add a new hero to the server */
// addHero (hero: Hero): Observable<Hero> {
//   return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
//     tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
//     catchError(this.handleError<Hero>('addHero'))
//   );
// }


/** DELETE: delete the hero from the server */
delete (id: Hero): Observable<any> {
  // const name = typeof id === 'number' ?  : id.Hero;
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<void>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted item id=${id}`)),
    catchError(this.handleError<void>('deleteItem'))
  );
}

/**Delete coffeeOrder */
deleteCoffeeOrder(data) {
  return this.firestore
      .collection("coffeeOrders")
      .doc(data.payload.doc.id)
      .delete();
}


/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}

}

