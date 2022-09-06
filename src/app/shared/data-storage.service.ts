import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://recipe-book-5e37a-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((recipes) => {
        console.log(recipes);
      });
  }

  fetchRecipes() {
    this.http
      .get<Recipe[]>(
        'https://recipe-book-5e37a-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(map((recipes:Recipe[]) =>{
        return recipes.map((recipe) => {
          return { ...recipe, ingredients: recipe.ingredients? recipe.ingredients : []}
        })
      }))
      .subscribe((recipes) => {
        this.recipeService.setRecipes(recipes);
        console.log(recipes);
      });
  }
}
