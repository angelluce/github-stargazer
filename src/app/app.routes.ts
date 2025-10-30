import {Routes} from '@angular/router';
import {Raffle} from './features/raffle/raffle';

export const routes: Routes = [
  {path: '', component: Raffle},
  {path: '**', redirectTo: ''}
];
