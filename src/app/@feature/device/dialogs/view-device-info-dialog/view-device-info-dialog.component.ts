import { takeUntil, tap } from 'rxjs/operators';
import { Subject, timer, interval } from 'rxjs';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DeviceService, IDeviceInfo } from '@core/services/device.service';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'view-device-info-dialog',
  templateUrl: './view-device-info-dialog.component.html',
  styleUrls: ['./view-device-info-dialog.component.scss']
})
export class ViewDeviceInfoDialogComponent implements OnInit, AfterViewInit  {
  @ViewChild("deviceCanvas")
  deviceCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  @Input()
  deviceId: number;
  deviceInfo: IDeviceInfo = <IDeviceInfo>{};
  qrCodeData: string = 'null';
  qrCodeArea = {
    x: 267,
    y: 189,
    size: 1
  };
  stopSubject = new Subject();
  constructor(
    private deviceService: DeviceService,
    protected dialogRef: NbDialogRef<ViewDeviceInfoDialogComponent>,
    ) { }
  ngAfterViewInit(): void {
    this.context = this.deviceCanvas.nativeElement.getContext('2d');
    this.initDeviceImg();
    this.initQrcodeImg();
  }
  initDeviceImg() {
    const deviceImage = new Image();
    deviceImage.src = 'assets/img/mmhg.png';
    deviceImage.onload = () => {
      const { width, height } = deviceImage;
      this.deviceCanvas.nativeElement.width = width;
      this.deviceCanvas.nativeElement.height = height;
      this.context.drawImage(deviceImage, 0, 0, width, height)
    };
  }
  initQrcodeImg() {
    const qrcodeImage = new Image();
    qrcodeImage.src = 'assets/img/qrcode.png';
    qrcodeImage.onload = () => {
      // const canvasWidth = this.deviceCanvas.nativeElement.width;
      // const canvasHeight = this.deviceCanvas.nativeElement.height;
      // const { width, height } = qrcodeImage;
      // const x = (canvasWidth/2) - (width/2);
      // const y = (canvasHeight/2) - (height/2);
      // this.qrCodeArea.x = x;
      // this.qrCodeArea.y = y;
      this.context.drawImage(qrcodeImage, this.qrCodeArea.x, this.qrCodeArea.y);
    };
  }
  modifyQrcodeImgArea(type: string) {
    interval(10).pipe(
        tap(() => this.initDeviceImg()),
        tap(() => {
          const qrcodeImage = new Image();
          qrcodeImage.src = 'assets/img/qrcode.png';
          qrcodeImage.onload = () => {
            this.setQrcodeArea(type, qrcodeImage);
            const { x, y, size } = this.qrCodeArea;
            const displayWidth = qrcodeImage.width*size;
            const displayheight = qrcodeImage.height*size;
            this.context.drawImage(qrcodeImage, x, y, displayWidth, displayheight)
          };
        }),
        takeUntil(this.stopSubject),
      ).subscribe()
  }

  setQrcodeArea(type: string, qrcodeImage: HTMLImageElement) {
    const typeLogic = [
      {
        logic: type === 'up',
        action: () => this.qrCodeArea.y = this.qrCodeArea.y - 1,
      },
      {
        logic: type === 'down',
        action: () => this.qrCodeArea.y = this.qrCodeArea.y + 1,
      },
      {
        logic: type === 'right',
        action: () => this.qrCodeArea.x = this.qrCodeArea.x + 1,
      },
      {
        logic: type === 'left',
        action: () => this.qrCodeArea.x = this.qrCodeArea.x - 1,
      },
      {
        logic: type === 'maximize',
        action: () => this.qrCodeArea.size = this.qrCodeArea.size + 0.01,
      },
      {
        logic: type === 'minimize',
        action: () => this.qrCodeArea.size = this.qrCodeArea.size - 0.01,
      },
      {
        logic: type === 'init',
        action: () => {
          const canvasWidth = this.deviceCanvas.nativeElement.width;
          const canvasHeight = this.deviceCanvas.nativeElement.height;
          const { width, height } = qrcodeImage;
          const x = (canvasWidth/2) - (width/2);
          const y = (canvasHeight/2) - (height/2);
          this.qrCodeArea.x = x;
          this.qrCodeArea.y = y
        }
      }
    ];
    typeLogic.find(item => item.logic)?.action();
  }
  ngOnInit(): void {
    this.deviceService.getDeviceInfo({ deviceId: this.deviceId }).subscribe(res => {
      this.deviceInfo = res;
      this.qrCodeData = JSON.stringify(res);
    });
  }
  close() {
    this.dialogRef.close();
  }
}
