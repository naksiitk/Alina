import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.css']
})
export class FilePreviewDialogComponent {

  constructor (@Inject(MAT_DIALOG_DATA) public doc_url : any) { }

}
