import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private igChangeSub: Subscription;

  constructor(private slService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsUpdated.subscribe(
      (ingredients: Ingredient[]) => {
        console.log(ingredients)
        this.ingredients = ingredients;
  }

    );
  };

  onEditItem = (index: number) => {
    this.slService.ingredientEdit.next(index)
  }
  ngOnDestroy() {
    this.igChangeSub.unsubscribe();
  }
}
