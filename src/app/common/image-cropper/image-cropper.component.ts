import { Component, EventEmitter, Output } from '@angular/core';
import { ImageCropperComponent as imgCropper, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../services/member.service';

interface AspectRatio {
  label: string;
  value: number;
}

@Component({
  selector: 'app-image-cropper',
  imports: [imgCropper,CommonModule],
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss'
})
export class ImageCropperComponent {
  @Output() imageCroppedEvent = new EventEmitter<string | string>();
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl | string = '';
  croppedBlob: Blob | null = null;
  showPreview = true;
  maintainAspectRatio = true;
  roundCropper = false;
  currentAspectRatio = 4 / 3;
  selectedRatio = 4 / 3;
  public isUploading:boolean = false;

  aspectRatios: AspectRatio[] = [
    { label: '1:1', value: 1 / 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: '3:2', value: 3 / 2 },
    { label: 'Free', value: NaN }
  ];

  constructor(private sanitizer: DomSanitizer,private _memberService:MemberService) {}

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  //  this.showPreview = false;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
    this.croppedBlob = event.blob!;
  }

  imageLoaded(image: LoadedImage): void {
    console.log('Image loaded successfully');
  }

  cropperReady(): void {
    console.log('Cropper ready');
  }

  loadImageFailed(): void {
    alert('Failed to load image. Please try another file.');
  }

  setAspectRatio(ratio: number): void {
    this.selectedRatio = ratio;
    if (isNaN(ratio)) {
      this.maintainAspectRatio = false;
    } else {
      this.maintainAspectRatio = true;
      this.currentAspectRatio = ratio;
    }
  }

  resetImage(): void {
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.croppedBlob = null;
    this.showPreview = false;
    this.selectedRatio = 4 / 3;
    this.currentAspectRatio = 4 / 3;
    this.maintainAspectRatio = true;
  }

  cancelCrop(): void {
    this.resetImage();
  }

  saveCroppedImage(): void {
  console.log("hi");
  if (!this.croppedBlob) {
    console.warn('No cropped image to upload');
    return;
  }
  this.isUploading = true;
  const formData = new FormData();
  formData.append('file', this.croppedBlob, `cropped-image-${Date.now()}.png`);
  this._memberService.uploadImageToBulb(formData).subscribe({
    next: (res) => {
      this.imageCroppedEvent.emit(res.Result);
      this.showPreview = true;
      this.resetImage();
    },
    error: (err) => {
      console.error('Upload failed:', err);
    },
    complete: () => {
      this.isUploading = false;

    }
  });
}

}
