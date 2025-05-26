import { EventEmitter } from '@angular/core';

export class EmitterService {
  static authemitter = new EventEmitter<any>();
}
