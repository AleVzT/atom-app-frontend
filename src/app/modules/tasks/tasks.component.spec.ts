import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { of, throwError } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Task } from '../../models/task.model';
import { HeaderComponent } from '../../core/header/headers.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  const mockTasks: Task[] = [
    {
      id: '1', title: 'Tarea 1', completed: false,
      description: '',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2', title: 'Tarea 2', completed: true,
      description: '',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'createTask', 'updateTask', 'deleteTask']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);

    await TestBed.configureTestingModule({
      imports: [TasksComponent, CommonModule, FormsModule, HeaderComponent, HttpClientTestingModule ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar tareas al inicializar', () => {
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    fixture.detectChanges(); // llama a ngOnInit

    expect(component.tasks.length).toBe(2);
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
  });

  it('debería manejar error al cargar tareas', () => {
    taskServiceSpy.getTasks.and.returnValue(throwError(() => new Error('fallo')));

    fixture.detectChanges();

    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Error al cargar las tareas');
    expect(component.isLoading).toBeFalse();
  });

  it('debería crear una tarea nueva', () => {
    component.newTaskTitle = 'Nueva tarea';
    component.newTaskDescription = 'Descripción';
    taskServiceSpy.createTask.and.returnValue(of({ id: '3', title: 'Nueva tarea', description: 'description tarea', completed: false, createdAt: '2024-01-01T00:00:00Z' }));
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    component.createOrUpdateTask();

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
      title: 'Nueva tarea',
      description: 'Descripción'
    });
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Tarea creada correctamente');
  });

  it('debería actualizar una tarea existente', () => {
    component.editingTask = { id: '1', title: 'Viejo título', description: 'description tarea', completed: false, createdAt: '2024-01-01T00:00:00Z' };
    component.newTaskTitle = 'Nuevo título';
    component.newTaskDescription = 'Nueva descripción';
    taskServiceSpy.updateTask.and.returnValue(of({ id: '1', title: 'Viejo título', description: 'description tarea', completed: false, createdAt: '2024-01-01T00:00:00Z' }));
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    component.createOrUpdateTask();

    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('1', {
      title: 'Nuevo título',
      description: 'Nueva descripción'
    });
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Tarea actualizada');
    expect(component.editingTask).toBeNull();
  });

  it('debería marcar una tarea como completada', () => {
    const task = { id: '1', title: 'Tarea', description: 'description tarea', completed: false, createdAt: '2024-01-01T00:00:00Z' };
    taskServiceSpy.updateTask.and.returnValue(of({ ...task, completed: true }));
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    component.toggleCompleted(task);

    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('1', { completed: true });
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Tarea marcada como completada');
  });

  it('debería eliminar una tarea', () => {
    taskServiceSpy.deleteTask.and.returnValue(of(undefined));
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    component.deleteTask('1');

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('1');
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Tarea eliminada correctamente');
  });

  it('debería manejar error al eliminar una tarea', () => {
    taskServiceSpy.deleteTask.and.returnValue(throwError(() => new Error('error')));

    component.deleteTask('1');

    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Ocurrió un error al eliminar la tarea');
  });

  it('debería iniciar la edición de una tarea', () => {
    const task = { id: '1', title: 'Editar', completed: false, description: 'Desc', createdAt: '2024-01-01T00:00:00Z' };

    component.startEdit(task);

    expect(component.editingTask).toEqual(task);
    expect(component.newTaskTitle).toBe('Editar');
    expect(component.newTaskDescription).toBe('Desc');
  });

  it('debería cancelar edición y limpiar el formulario', () => {
    component.editingTask = mockTasks[0];
    component.newTaskTitle = 'Algo';
    component.newTaskDescription = 'Otra cosa';

    component.cancelEdit();

    expect(component.editingTask).toBeNull();
    expect(component.newTaskTitle).toBe('');
    expect(component.newTaskDescription).toBe('');
  });

  it('debería crear una nueva tarea correctamente', () => {
    const task = { id: '1', title: 'Editar', completed: false, description: 'Desc', createdAt: '2024-01-01T00:00:00Z' };
    component.newTaskTitle = 'Tarea nueva';
    component.newTaskDescription = 'Descripción de la tarea nueva';
    component.editingTask = null;
  
    taskServiceSpy.createTask.and.returnValue(of(task));
    const loadTasksSpy = spyOn(component, 'loadTasks');
  
    component.createOrUpdateTask();
  
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
      title: 'Tarea nueva',
      description: 'Descripción de la tarea nueva'
    });
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Tarea creada correctamente');
    expect(loadTasksSpy).toHaveBeenCalled();
    expect(component.newTaskTitle).toBe('');
    expect(component.newTaskDescription).toBe('');
  });

  it('debería actualizar una tarea existente', () => {
    const task = { id: '1', title: 'Editar', completed: false, description: 'Desc', createdAt: '2024-01-01T00:00:00Z' };

    component.editingTask = {
      id: '123',
      title: 'Viejo título',
      description: 'Vieja descripción',
      completed: false,
      createdAt: '2024-01-01T00:00:00Z'
    };
    component.newTaskTitle = 'Nuevo título';
    component.newTaskDescription = 'Nueva descripción';
  
    taskServiceSpy.updateTask.and.returnValue(of(task));
    const loadTasksSpy = spyOn(component, 'loadTasks');
  
    component.createOrUpdateTask();
  
    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('123', {
      title: 'Nuevo título',
      description: 'Nueva descripción'
    });
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Tarea actualizada');
    expect(loadTasksSpy).toHaveBeenCalled();
    expect(component.editingTask).toBeNull();
  });

  it('no debería crear ni actualizar si el título está vacío', () => {
    component.newTaskTitle = '   ';
    const loadTasksSpy = spyOn(component, 'loadTasks');
  
    component.createOrUpdateTask();
  
    expect(taskServiceSpy.createTask).not.toHaveBeenCalled();
    expect(taskServiceSpy.updateTask).not.toHaveBeenCalled();
    expect(loadTasksSpy).not.toHaveBeenCalled();
  });
  
  
  
});
