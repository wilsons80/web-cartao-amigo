import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherRoutingModule } from './voucher-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComboPesquisavelModule } from '../common/combo-pesquisavel/combo-pesquisavel.module';
import { VoucherComponent } from './voucher.component';
import { VoucherDialogComponent } from './voucher-dialog/voucher-dialog.component';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
import { MatListModule } from '@angular/material/list';
import { MatLineModule } from '@angular/material/core';

@NgModule({
  declarations: [VoucherComponent, VoucherDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,   
    SharedPipesModule,
    MatListModule,
    MatLineModule,
    ComboPesquisavelModule,
    VoucherRoutingModule,
  ]
})
export class VoucherModule { }
