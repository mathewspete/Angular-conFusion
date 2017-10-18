import { Component, OnInit, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  newComment: Comment;
  ratings = {min: 1, max: 5, value: 5, thumbLabel: true, showTicks: true, autoTicks: false, tickInterval: 1};
  commentForm: FormGroup;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    }
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    // (+) before params['id'] turns the string into a number
    this.route.params
      .switchMap((params: Params) => this.dishService.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
 }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: [this.ratings.value],
      comment: ['', [Validators.required]],
      author: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
 }

 onValueChanged(data?: any) {
   if (!this.commentForm) { return; }
   const form = this.commentForm;
   for (const field in this.formErrors) {
     // clear previous error message (if any)
     this.formErrors[field] = '';
     const control = form.get(field);
     if (control && control.dirty && !control.valid) {
       const messages = this.validationMessages[field];
       for (const key in control.errors) {
         this.formErrors[field] += messages[key] + ' ';
       }
     }
   }
 }

 get tickInterval(): number | 'auto' {
   return this.ratings.showTicks ? (this.ratings.autoTicks ? 'auto' : this.ratings.tickInterval) : 0;
 }

 onSubmit() {
   this.newComment = this.commentForm.value;
   this.newComment.date = new Date().toISOString();
   console.log(this.newComment);
   this.dish.comments.push(this.newComment);

   this.commentForm.reset({
     rating: this.ratings.value,
     comment: '',
     author: ''
   });
 }
}