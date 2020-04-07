import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent {
  // heroes: Hero[];
 
  // constructor(private heroService: HeroService) { }

  heroes: Observable<any[]>;

  // ngOnInit() {
  //   this.getHeroes();
  // }
  coffeeOrders: Observable<any[]>;

  constructor(firestore: AngularFirestore, public heroService: HeroService) {
    this.coffeeOrders = firestore.collection('coffeeOrders').snapshotChanges();
    this.heroes = firestore.collection('heroes').valueChanges();
  }

  markCompleted (data) {
    this.heroService.updateCoffeeOrder(data);

  }
 
  deleteOrder(data){
  this.heroService.deleteCoffeeOrder(data);
}

  // ngOnInit() {this.getCoffeeOrders();}
  
  // getCoffeeOrders = () =>
  //     this.heroService
  //     .getCoffeeOrders()
  //     .subscribe(res =>(this.coffeeOrders = res));

  // getHeroes(): void {
  //   this.heroService.getHeroes()
  //       .subscribe(heroes => this.heroes = heroes);
  // }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero);
  }



  // delete(hero: Hero): void {
  //   this.heroService.deleteHero(hero);
  // }

  // delete(hero: Hero): void {
  //   this.heroes = this.heroes.filter(h => h !== hero);
  //   this.heroService.deleteHero(hero).subscribe();
  // }

  //   delete(item: Observable<any[]>): void {
  //   this.items = this.items.filter(h => h !== item);
  //   this.heroService.delete(item).subscribe();
  // }

}


