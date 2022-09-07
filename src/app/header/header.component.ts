import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DataStoreService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() loadedFeatutueEvent = new EventEmitter<string>();

  isAuthenticated: boolean = false;
  constructor(private dataStoreService: DataStoreService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user

    })
  }

  loadingFeature = (feature: string) => {
    this.loadedFeatutueEvent.emit(feature);
  }

  onSaveRecipes(){
    this.dataStoreService.storeRecipes()
  }

  onFetchRecipes(){
    this.dataStoreService.fetchRecipes()
  }

  onLogOut(){
    this.authService.logout()
  }

}
