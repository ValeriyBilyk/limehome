import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

declare var H: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  private platform: any;
  public selectedMarker;
  public hotels = [];

  @ViewChild('map')
  public mapElement: ElementRef;

  public constructor() {
    this.platform = new H.service.Platform({
      apikey: 'TB7ywbZTsiUU6HYqrlyG594LuKYF_eDDfKOEYrhG5eg'
    });
  }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.vector.normal.map,
      {
        zoom: 14,
        center: {lat: 52.520008, lng: 13.404954}
      }
    );
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    let ui = H.ui.UI.createDefault(map, defaultLayers);
    window.addEventListener('resize', () => map.getViewPort().resize());

    let placesService = this.platform.getPlacesService();
    let parameters = {
      at: '52.520008,13.404954',
      cat: 'accommodation'
    };

    let icon = new H.map.Icon('assets/default-icon.svg');
    let activeIcon = new H.map.Icon('assets/active-icon.svg');

    placesService.explore(parameters,
      (result) => {
        result.results.items.forEach((item, index) => {
          let marker = new H.map.Marker({lat: item.position[0], lng: item.position[1]}, {icon});
          this.hotels.push(item);
          marker.addEventListener('tap', (info) => {
            console.log(item);
            if (this.selectedMarker === marker) {
              return;
            }

            if (this.selectedMarker) {
              this.selectedMarker.setIcon(icon);
            }
            this.selectedMarker = marker;
            this.selectedMarker.setIcon(activeIcon);

          });
          map.addObject(marker);
        });
      }, (error) => {
        console.error(error);
      });

  }

}
