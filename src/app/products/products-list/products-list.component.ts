import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product.model';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/effects/effect-shake';
import 'jquery-ui/ui/effects/effect-bounce';
import 'jquery-ui/ui/effects/effect-highlight';

let randomDeltas = Array(100).fill(1).map(_ => Math.round(40*(Math.random()-0.5)));

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent {
  @Input() products: Product[] | null = [];
  @Input() total: number | null = 0;
  @Input() showProductCode: boolean | null = false;
  @Output() toggleProductCode = new EventEmitter<void>();

  ngOnChanges() {
    if (this.showProductCode) $(".pr-code-cell").on("mouseenter", function() { 
      ($(this) as any).effect( "highlight", { color: 'orange'} );
   });
  }

  ngAfterViewInit() {
      ($(".drgble") as any).draggable();
      $(".product-cell").on("mouseenter", function() { 
          ($(this) as any).effect( "highlight", { color: '#1F2937'} );
          changePricesRotate();
        })
      $(".currency-cell").odd().css({ transform: 'rotate(-8deg)' })
      $(".currency-cell").even().css({ transform: 'rotate(5deg)' })       
      $(".edit-cell").on("mouseenter", function() { 
         ($(this) as any).effect( "highlight", { color: 'lightgreen'} );
      })
      $("#showcode").on('click', () =>
         ($("#showcode") as any).toggle( "fade")
      );
      $('#add_button').on("mouseenter", (e) => { buttonWanderings(); changePricesRotate(); } )
  }
}

 function buttonWanderings() {
      const hor = Math.random()-0.5;
      const ver = Math.random()-0.4;
      $('#add_button').animate({
        left: `+=${Math.round(hor*50)}%`,
        top: `+=${Math.round(ver*200)}px` }, 50
        )
    }
function  changePricesRotate() {
      const next = randomDeltas.shift() || 8;
      $(".currency-cell").odd().css({ transform: `rotate(${next}deg)` });
      $(".currency-cell").even().css({ transform: `rotate(${-1*next}deg)` });    
      $(".edit-cell").odd().css({ left: `${-2*next}px` });
      $(".edit-cell").even().css({ left: `${2*next}px` });       
    }