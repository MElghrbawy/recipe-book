import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataStoreService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() loadedFeatutueEvent = new EventEmitter<string>();

  constructor(private dataStoreService: DataStoreService) { }

  ngOnInit(): void {
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

}
