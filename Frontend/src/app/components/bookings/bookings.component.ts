import { Component, OnInit } from '@angular/core';

// import service
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  public reservation:any = this.storage.get();

  constructor(public storage:StorageService) { }

  ngOnInit(): void {
  }

  cancelRes(i:any) {
    alert("Reservation cancelled!");
    this.storage.remove(i);
    this.reservation = this.storage.get();
  }

}
