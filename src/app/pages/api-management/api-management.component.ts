import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ApiEndpoint, CreateApiRequest } from '../../models/interfaces';

@Component({
  selector: 'app-api-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-management.component.html',
  styleUrl: './api-management.component.css',
})
export class ApiManagementComponent implements OnInit {
  apis: ApiEndpoint[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;

  formData: CreateApiRequest = {
    name: '',
    url: '',
    checkInterval: 10,
  };

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadApis();
  }

  loadApis() {
    this.loading = true;
    this.apiService.getApis().subscribe({
      next: (apis) => {
        this.apis = apis;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openAddForm() {
    this.formData = { name: '', url: '', checkInterval: 10 };
    this.editingId = null;
    this.showForm = true;
  }

  openEditForm(api: ApiEndpoint) {
    this.formData = {
      name: api.name,
      url: api.url,
      checkInterval: api.checkInterval,
    };
    this.editingId = api.id;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  saveApi() {
    if (!this.formData.name || !this.formData.url) return;

    if (this.editingId) {
      this.apiService.updateApi(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadApis();
          this.closeForm();
        },
      });
    } else {
      this.apiService.createApi(this.formData).subscribe({
        next: () => {
          this.loadApis();
          this.closeForm();
        },
      });
    }
  }

  deleteApi(id: number) {
    if (confirm('Are you sure you want to delete this API?')) {
      this.apiService.deleteApi(id).subscribe({
        next: () => this.loadApis(),
      });
    }
  }

  toggleActive(api: ApiEndpoint) {
    this.apiService.updateApi(api.id, { isActive: !api.isActive }).subscribe({
      next: () => this.loadApis(),
    });
  }

  getStatusClass(status: string): string {
    return `badge badge-${status}`;
  }
}
