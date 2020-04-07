import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent  {
  items: Observable<any[]>;

  coffees = [

    {
      coffeeType: "Americano",
      price: 3.05
    },

    {
      coffeeType: "Flat White",
      price: 2.20
    },

    {
      coffeeType: "Cappuccino",
      price: 4.00
    },


  ];
     
  //   "Americano",
  //   "Flat White", 
  //   "Cappuccino", 
  //   "Latte", 
  //   "Espresso", 
  //   "Machiato", 
  //   "Mocha", 
  //   "Hot Chocolate", 
  //   "Tea"
  // ];
  
  constructor(public heroService: HeroService, public firestore: AngularFirestore) {
    this.items = firestore.collection('items').valueChanges();
  }

  coffeeOrder = [];
  addCoffee = coffee =>
  this.coffeeOrder.push(coffee);
  
  removeCoffee = coffee => {
  let index = this.coffeeOrder.indexOf(coffee);
  if (index > -1) this.coffeeOrder.splice(index, 1);
};

onSubmit() {

  this.heroService.form.value.coffeeOrder = this.coffeeOrder;
  let data = this.heroService.form.value;
 
  
 this.heroService.createCoffeeOrder(data)
     .then(res => {
       console.log("form submitted");
      this.heroService.form.reset();
         /*do something here....
         maybe clear the form or give a success message*/
     });
     
     

};


}