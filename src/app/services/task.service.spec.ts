import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener la lista de tareas', () => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Tarea 1', description: 'Desc 1', completed: false, createdAt: '2024-01-01' },
      { id: '2', title: 'Tarea 2', description: 'Desc 2', completed: true, createdAt: '2024-01-02' },
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('debería crear una nueva tarea', () => {
    const newTask = { title: 'Nueva tarea', description: 'Descripción' };
    const mockResponse: Task = {
      id: '1',
      ...newTask,
      completed: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockResponse);
  });

  it('debería actualizar una tarea', () => {
    const id = '123';
    const changes = { title: 'Actualizado' };
    const mockUpdatedTask: Task = {
      id,
      title: 'Actualizado',
      description: 'desc',
      completed: false,
      createdAt: '2024-01-01'
    };

    service.updateTask(id, changes).subscribe(task => {
      expect(task).toEqual(mockUpdatedTask);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(changes);
    req.flush(mockUpdatedTask);
  });

  it('debería eliminar una tarea', () => {
    const id = '123';

    service.deleteTask(id).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

