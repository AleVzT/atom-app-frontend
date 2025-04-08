import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../core/header/headers.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private snackbarService = inject(SnackbarService);

  tasks: Task[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  editingTask: Task | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: () => {
        this.snackbarService.show('Error al cargar las tareas');
        this.isLoading = false;
      }
    });
  }

  createOrUpdateTask(): void {
    if (!this.newTaskTitle.trim()) return;

    if (this.editingTask) {
      const updatedTask: Partial<Task> = {
        title: this.newTaskTitle,
        description: this.newTaskDescription
      };

      this.taskService.updateTask(this.editingTask.id, updatedTask).subscribe({
        next: () => {
          this.snackbarService.show('Tarea actualizada');
          this.resetForm();
          this.loadTasks();
        }
      });
    } else {
      this.taskService.createTask({
        title: this.newTaskTitle,
        description: this.newTaskDescription
      }).subscribe({
        next: () => {
          this.snackbarService.show('Tarea creada correctamente');
          this.resetForm();
          this.loadTasks();
        }
      });
    }
  }

  toggleCompleted(task: Task): void {
    this.taskService.updateTask(task.id, { completed: !task.completed }).subscribe({
      next: (updatedTask) => {
        this.snackbarService.show(`Tarea marcada como ${updatedTask.completed ? 'completada' : 'pendiente'}`);
        this.loadTasks();
      }
    });
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.snackbarService.show('Tarea eliminada correctamente');
        this.loadTasks();
      },
      error: () => {
        this.snackbarService.show('Ocurrió un error al eliminar la tarea');
      }
    });
  }

  startEdit(task: Task): void {
    this.editingTask = task;
    this.newTaskTitle = task.title;
    this.newTaskDescription = task.description || '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.editingTask = null;
  }
}
