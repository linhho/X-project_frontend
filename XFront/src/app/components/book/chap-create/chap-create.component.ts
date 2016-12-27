import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Story } from '../../../model/story.model';
import { ChapService } from './chap.service';
import { Subscription, Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SlugService } from '../../../services/slug.service';
import { ApiService } from '../../../services/api.service';
import { Chapters } from '../../../model/chapters.model';

@Component({
  selector: 'app-chap-create',
  templateUrl: './chap-create.component.html',
  styleUrls: ['./chap-create.component.css']
})
export class ChapCreateComponent implements OnInit, OnDestroy {
  @Input() stories: Story;
  
  
  chapForm: FormGroup;
  private _subscription: Subscription;
  private _isNew = true;
  private _chap: Chapters;
  private _chapIndex: number;

  userInfo: any = JSON.parse(localStorage.getItem('profile'));
  constructor(private _chapService: ChapService,          
              private _slug: SlugService,
              private _api: ApiService,
              private _formBuilder: FormBuilder,
              private _route: ActivatedRoute) { }

  ngOnInit() {
        this._subscription = this._route.params.subscribe(
      (params: any) => {
        if(params.hasOwnProperty('StoryId')){
          this._isNew = false;
          this._chapIndex =  +params['StoryId'];
          this._chap = this._chapService.getChapter(this._chapIndex);
        } else {
          this._isNew = true;
          this._chap = null;
        }
        
      }
    )
    this.initForm();
  }
  
  onSubmit() {
      const newChap = this.chapForm.value();
      if(this._isNew){
        this._chapService.addChap(newChap);
      } else {
        this._chapService.updateChap(this._chap);
      }
      this._chapService.navigateBack()
      console.log(newChap);
  }

  ngOnDestroy(){
    this._subscription.unsubscribe();
  }

  private initForm() {
    let StoryId = 24;
    let ChapterNumber;
    let ChapterTitle = '';
    let ChapterContent = '';
    let ChapterStatus;
    let UploadedDate = new Date().toUTCString();
    let LastEditedDate = new Date().toUTCString();
    let UserId = this.userInfo.user_id;
    let Slug = '';

    if(!this._isNew) {
      StoryId = this._chap.StoryId;
      ChapterNumber = this._chap.ChapterNumber;
      ChapterTitle = this._chap.ChapterTitle;
      ChapterContent = this._chap.ChapterContent;
      ChapterStatus = this._chap.ChapterStatus;
      UploadedDate = this._chap.UploadedDate.toUTCString();
      LastEditedDate = this._chap.LastEditedDate.toUTCString();
      UserId = this._chap.UserId;
      Slug = this._chap.Slug;
    }
      //Chap FormBuilder
      this.chapForm = this._formBuilder.group({
          StoryId: [StoryId],
          ChapterNumber : [ChapterNumber],
          ChapterTitle : [ChapterTitle],
          ChapterContent : [ChapterContent],
          ChapterStatus : [ChapterStatus],
          UploadedDate : [UploadedDate],
          LastEditedDate : [LastEditedDate],
          UserId : [UserId],
          Slug : [Slug]
      }); 
    
  }


  onCancel() {
    this._chapService.navigateBack();
  }
  
}
