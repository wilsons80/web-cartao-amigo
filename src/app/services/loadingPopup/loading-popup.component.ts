import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'loading-popup',
  templateUrl: './loading-popup.component.html',
  styleUrls: ['./loading-popup.component.css']
})
export class LoadingPopupComponent implements OnInit {
  mensagem: string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.mensagem = data.mensagem;
  }

  ngOnInit(): void {
  }

}
