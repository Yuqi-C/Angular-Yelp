import { Component, OnInit, Input } from '@angular/core';


// import HttpClient 1. import 2. constructor
import { HttpClient, HttpHeaders } from '@angular/common/http';

// synchronours
import { firstValueFrom } from "rxjs"
import { ThisReceiver } from '@angular/compiler';

// import service 
import { StorageService } from 'src/app/services/storage.service';

// import FormBuilder service
import { FormBuilder } from '@angular/forms'
import { Validators } from '@angular/forms'
import { createUrlTreeFromSnapshot } from '@angular/router';

// jquery
declare var $: any;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  @Input() results:Array<any> = []; 
  
  
  public detail:any;
  public displayRes:boolean = true;
  public displayDet:boolean = false;
  public displayMod:boolean = false;
  public reserved:boolean = false;
  //icon
  public twitter:any;
  public facebook:any;

  // map
  public mapOptions: google.maps.MapOptions = {};
  public marker:any;
  // reviews
  public reviews:any;
  // reservation form
  public todayDate:any = new Date();
  public submitted:boolean = false;

  public reservation = this.fb.group({
    myEmail: ['', [Validators.required, Validators.email]],
    myDate: ['mm/dd/yyyy', Validators.required],
    myHour: ['', Validators.required],
    myMin: ['', Validators.required]
  })

  constructor(public http:HttpClient, public storage:StorageService, public fb:FormBuilder) {}

  ngOnInit(): void { 
  }

  get f() { return this.reservation.controls;}

  validate(event:any){
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }


  getDist(num:any) {
    return Math.round( num / 1609.34);
  }

  async getReiviews(id:any) {
    let uri = `https://cs571hw8node.wl.r.appspot.com/reviews/${id}`;
    this.reviews = await firstValueFrom(this.http.get(uri));
  }

  async getDetail(id:any) {
    let uri = `https://cs571hw8node.wl.r.appspot.com/searchId/${id}`;
    const data:any = await firstValueFrom(this.http.get(uri));
    let category = '';
    let addr = '';
    for(let i = 0; i < data.categories.length; i++){
      category += data.categories[i].title;
      if(i < data.categories.length-1) category += " | "
    }
    const display_address = data.location.display_address
    for(let i = 0; i < display_address.length; i++){
      addr += display_address[i];
      if(i < display_address.length-1) addr += " ";
    }
    let status;
    if("hours" in data){
      status = data.hours[0].is_open_now;
    }else{
      status = !data.is_closed;
    }

    this.twitter = `https://twitter.com/compose/tweet?text=Check%20${data.name}%20on%20Yelp%21%0A${data.url}`;
    this.facebook = `https://www.facebook.com/sharer/sharer.php?u=${data.url}`;

    this.detail = {
      name: data.name,
      address: addr,
      category: category,
      phone: data.display_phone,
      price: data.price,
      status: status,
      link: data.url,
      photos: data.photos,
      latitude: data.coordinates.latitude,
      longitude: data.coordinates.longitude
    }
  }

  async clickRow(id:any){
    await this.getDetail(id);
    await this.getReiviews(id);
    this.displayRes = false;
    this.displayDet = true;
    this.mapOptions = {
      center: { lat: this.detail.latitude, lng: this.detail.longitude },
      zoom: 14
    }  
    this.marker = {
      position: {lat: this.detail.latitude, lng: this.detail.longitude }
    }
  }

  goBack() {
    this.displayRes = true;
    this.displayDet = false;
    this.reserved = false;
  }

  reserve(){
    this.submitted = true;
    if(this.reservation.invalid) return;
    alert("Reservation Created!");
    $('#myModal').modal('hide');
    this.reserved = true; // create reservation 
    const info = {
      res_name: this.detail.name,
      res_date: this.reservation.get('myDate')?.value,
      res_time: this.reservation.get('myHour')?.value + ":" + this.reservation.get('myMin')?.value,
      res_email: this.reservation.get('myEmail')?.value
    }
    this.storage.set(info);
  }

  formReset() {
    this.submitted = false;
    this.reservation.reset();
  }

  cancelBtn() {
    alert("Reservation cancelled!")
    this.reserved = false; // cancel reservation
    const list = this.storage.get();
    this.storage.remove(list.length-1);
  }
}
