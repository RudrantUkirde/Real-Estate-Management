import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Property } from '../models/property.model';
import { PropertyService } from './mapServices/property.service';
import { StorageService } from '../user/UserService/storage.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../shared-component/snackbar.service';
import { SettingsService } from '../settings/service/settings.service';


  const residentialIcon = L.icon({
    iconUrl: '/icons/residential.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  const commercialIcon = L.icon({
    iconUrl: '/icons/commercial.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  const industrialIcon = L.icon({
    iconUrl: '/icons/industrial.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  const landIcon = L.icon({
    iconUrl: '/icons/land.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  constructor(private propertyService: PropertyService,private router:Router,private snackbarService:SnackbarService,private settingsService:SettingsService){}


  latitude = 19.0760;
  longitude = 72.8777;
  private map: L.Map | undefined;
  private markers: L.Marker[] = [];

  properties: Property[] = [];

  // Define categories if you want to use category filtering (adjust accordingly)
  categories = [
    { key: 'RESIDENTIAL', name: 'Residential', color: '#34D399', visible: true },
    { key: 'COMMERCIAL', name: 'Commercial', color: '#3B82F6', visible: true },
    { key: 'INDUSTRIAL', name: 'Industrial', color: '#F59E42', visible: true },
    { key:'LAND', name:'Land' , color:'#F59E42', visible:true}
  ];

  ngAfterViewInit(): void {
    // Ensure map resizes correctly on load and after UI/layout changes
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        this.map.setView([this.latitude, this.longitude], 13); // your desired center and zoom
      }
    }, 0);
  }

  ngOnInit(): void {

    this.settingsService.latitude$.subscribe(lat => {
      this.latitude = lat;
    });
    this.settingsService.longitude$.subscribe(lng => {
      this.longitude = lng;
    });

    this.initMap();
    // Fetch all properties (use a large enough page size, or implement API for all)
    this.propertyService.getProperties(0, 1000).subscribe(response => {
      this.properties = response.content;
      this.showPropertyMarkers();
    });
  }

  initMap(): void {
    this.map = L.map('map').setView([this.latitude,this.longitude], 13); // Default to Mumbai
    L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }
  ).addTo(this.map!);
  }

  showPropertyMarkers(): void {
    // Remove previous markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];


    this.properties.forEach(property => {
      // You need to have latitude and longitude on your Property entity
      if (property.latitude && property.longitude) {


        let icon = residentialIcon;
        switch (property.propertyType) {
          case 'COMMERCIAL':
            icon = commercialIcon; break;
          case 'INDUSTRIAL':
            icon = industrialIcon; break;
          case 'LAND':
            icon = landIcon; break;
          // Default is residential
        }

        const typeStyle = this.getPropertyTypeStyle(property.propertyType);

        const popupHtml = `
          <div style="min-width:190px;max-width:210px;">
            <div style="font-weight:700;font-size:1.05rem;margin-bottom:4px;line-height:1.25;">
              ${property.title}
            </div>
            <div style="display:inline-block;background:#EF4444;color:white;font-size:0.83rem;font-weight:600;padding:1.5px 8px 1.5px 8px;border-radius:5px;margin-bottom:6px; ${typeStyle}">
              ${property.propertyType === 'RESIDENTIAL' ? 'Residential Real Estate' :
                property.propertyType === 'COMMERCIAL' ? 'Commercial Real Estate' :
                property.propertyType === 'INDUSTRIAL' ? 'Industrial Real Estate' : 'Land Real Estate'}
            </div>
            <div style="font-size:0.85rem;color:#000000;margin:6px 0 9px 0;line-height:1.3;">
              ${property.address}
            </div>
            <button id="view-more-btn-${property.id}" 
                style="width:100%;background:#2563EB;color:white;font-weight:600;border:none;padding:6px 0;border-radius:5px;font-size:0.94rem;cursor:pointer;outline:none;box-shadow:0 1.5px 8px rgba(60,90,240,0.04);">
              VIEW MORE
            </button>
          </div>
        `;


        const marker = L.marker([property.latitude, property.longitude],{icon})
          .addTo(this.map!)
          .bindPopup(popupHtml);

          marker.on('click', () => {
            this.map!.flyTo([property.latitude, property.longitude], 15, { animate: true, duration: 1.2 });
            marker.openPopup();
          });

          marker.on('popupopen',()=>{

            setTimeout(() => { // timeout ensures DOM is rendered
              const btn = document.getElementById(`view-more-btn-${property.id}`);
              if (btn) {
                btn.onclick = () => {
                  const token=StorageService.getToken();
                  if (token) {
                    this.router.navigateByUrl(`/properties/property-details/${property.id}`)
                  } else {
                    this.router.navigate(['/user/signin']);
                    this.snackbarService.show('Please login to view property details!!','error');
                    
                  }
                };
              }
            }, 0);

          });

        this.markers.push(marker);
      }
    });
  }

  // Optional: Toggle category markers
  toggleMarkers(categoryKey: string) {
    // Filter properties according to visible categories and update markers
    const visibleCategories = this.categories.filter(c => c.visible).map(c => c.key);
    const filteredProperties = this.properties.filter(p => visibleCategories.includes(p.propertyType));
    this.properties = filteredProperties;
    this.showPropertyMarkers();
  }

   getPropertyTypeStyle(propertyType: string): string {
  switch (propertyType) {
    case 'RESIDENTIAL':
      return 'background:#EF4444;color:#fff'; // Red bg, white text
    case 'COMMERCIAL':
      return 'background:#9333EA;color:#fff;'; // Purple bg, white text
    case 'INDUSTRIAL':
      return 'background:#FACC15;color:#22223B;'; // Yellow bg, dark text
    case 'LAND':
      return 'background:#22C55E;color:#fff;'; // Green bg, white text
    default:
      return 'background:#EF4444;color:#fff;'; // Red bg, white text
    }
  }


}
