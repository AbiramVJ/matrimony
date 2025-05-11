export class Education {
  id: string;
  name: string;
  isActive: boolean;

  constructor(obj: any) {
    this.id = obj?.id ?? '';
    this.name = obj.name ?? 'unknown education';
    this.isActive = obj?.isActive ?? false;
  }
}
