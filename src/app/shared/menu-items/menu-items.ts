import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'button', type: 'link', name: 'Irish Breakdown', icon: 'trending_up' },
  { state: 'dashboard', name: 'World Live Data', type: 'link', icon: 'language' },
  { state: 'lists', type: 'link', name: 'About', icon: 'info' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
