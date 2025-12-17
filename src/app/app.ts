import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidacionesPropias } from './validaciones-propias';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('DejovenesAngular');
  miFormulario!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.miFormulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(60), Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.maxLength(80), Validators.minLength(2)]],
      dniInput: ['', [Validators.required, ValidacionesPropias.validarDni]],
      fecha: ['', [Validators.required, ValidacionesPropias.validarFecha]],
      genero: ['', Validators.required],
      dniFoto: ['', Validators.required],
      intereses: ['', [Validators.required]],
      cp: ['', [Validators.required, Validators.pattern("[0-9]{5}"), ValidacionesPropias.validarCP.bind(ValidacionesPropias)]],
      provincia: [{ value: '', disabled: false }, Validators.required],
      situacionActual: ['', Validators.required],
      acepto: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.miFormulario.valid) {
      const datos = JSON.stringify(this.miFormulario.value, null, 2);
      alert('Formulario enviado con éxito:\n' + datos);
      console.log('Datos del formulario:', this.miFormulario.value);
    } else {
      alert('Por favor, rellene todos los campos correctamente.');
    }
  }

  resetForm() {
    this.miFormulario.reset({ acepto: false });
  }
}
