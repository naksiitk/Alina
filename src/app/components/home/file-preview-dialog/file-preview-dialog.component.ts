import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.css']
})
export class FilePreviewDialogComponent {

  constructor (@Inject(MAT_DIALOG_DATA) public Blob : any, private pdfViewerService: NgxExtendedPdfViewerService) {
    
  }
  public page = 1;
  public dark = 'dark'
  public pageLabel: string;

   public spreadMode: 'off' | 'even' | 'odd' = 'off';

   public onPageRendered(): void {
     if (!this.pdfViewerService.isRenderQueueEmpty()) {
       // try again later when the pages requested by the pdf.js core or the user have been rendered
       setTimeout(() => this.onPageRendered(), 100);
     }
 
     const pagesBefore = this.spreadMode === 'off' ? 2 : 2;
     const pagesAfter = this.spreadMode === 'off' ? 2 : 5;
     let startPage = Math.max(this.page - pagesBefore, 1);
     let endPage = Math.min(this.page  + pagesAfter, this.pdfViewerService.numberOfPages());
 
     const renderedPages = this.pdfViewerService.currentlyRenderedPages();
 
     for (let page = startPage; page <= endPage; page++) {
       const pageIndex = page - 1;
       if (!this.pdfViewerService.hasPageBeenRendered(pageIndex)) {
           this.pdfViewerService.addPageToRenderQueue(pageIndex);
           break; // break because you can request only one page at a time
       }
     }

   }

}
