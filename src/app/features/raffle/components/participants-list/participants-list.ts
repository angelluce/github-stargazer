import {Component, computed, input, signal} from '@angular/core';
import {Stargazer} from '../../../../core/interfaces/stargazer.interface';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-participants-list',
  imports: [
    DatePipe
  ],
  templateUrl: './participants-list.html',
  styleUrl: './participants-list.css',
})
export class ParticipantsList {
  participants = input.required<Stargazer[]>();
  maxDisplay = input<number>(20);

  showAll = signal(false);

  displayedParticipants = computed(() => {
    const all = this.participants();
    return this.showAll() ? all : all.slice(0, this.maxDisplay());
  });

  toggleShowAll() {
    this.showAll.update(value => !value);
  }
}
