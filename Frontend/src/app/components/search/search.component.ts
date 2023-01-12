import { Component, OnInit } from '@angular/core';

// import HttpClient 1. import 2. constructor
import { HttpClient, HttpHeaders } from '@angular/common/http';

// synchronours
import { firstValueFrom } from "rxjs"

// autocomplete
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(public http:HttpClient) { }

  public searchForm:any = {
    keyword: "",
    distance: "10",
    category: "Default",
    location: "",
    checked: false,
    lat: "",
    lgt: ""
  }

  // autocomplete
  public searchCtrl = new FormControl();
  public filtered:any;
  public isLoading = false;
 
  // results
  public displayRes = false;
  public results:Array<any> = [];

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= 1
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.filtered = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get(`https://cs571hw8node.wl.r.appspot.com/autocomplete?text=${value}`)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data:any) => {
        this.filtered = data;
      });
  }

  async getLocByInput() {
    let uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.searchForm.location}&key=AIzaSyA15LHOXZAKVDceS3qIuHnbn0MyyCDaiDM`;
    await firstValueFrom(this.http.get(uri)).then((res:any) => {
      this.searchForm.lat = res.results[0].geometry.location.lat.toString();
      this.searchForm.lgt = res.results[0].geometry.location.lng.toString();
    })
  }

  async getLocByAuto() {
    let uri = `https://ipinfo.io/json?token=c5a96995ca9e33`;
    await firstValueFrom(this.http.get(uri)).then((res:any) => {
      let loc = res.loc.split(",")
      this.searchForm.lat = (loc[0]);
      this.searchForm.lgt = (loc[1]);
    })
  }

  async getBusinesses() {
    var uri = `https://cs571hw8node.wl.r.appspot.com/search?keyword=${this.searchForm.keyword}&lat=${this.searchForm.lat}&lgt=${this.searchForm.lgt}&category=${this.searchForm.category}&distance=${this.searchForm.distance}`;
    const res = await firstValueFrom(this.http.get(uri))
    return Object.values(res).slice(0, 10);
  }

  isValid() {
    if(this.searchForm.keyword == '' || this.searchForm.distance == '') return false;
    if(!this.searchForm.checked && this.searchForm.location == '') return false;
    return true;
  }

  async onSubmit(){
    if(!this.isValid()) return;
    if(!this.searchForm.checked){
      await this.getLocByInput();
    }else{
      await this.getLocByAuto();
    }
    this.results = await this.getBusinesses();
    this.displayRes = true;
  }
  
  chkBox() {
    this.searchForm.location = '';
  }

  clearButton(){
    this.displayRes = false;
    this.searchForm.keyword = "";
    this.searchForm.distance = "10";
    this.searchForm.category = "Default";
    this.searchForm.location = "";
    this.searchForm.checked = false;
    this.searchForm.lat = "";
    this.searchForm.lgt = "";
    this.filtered = [];
  }

}
