import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class ValidacionesPropias {
  static validarDni(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;

    const valorMayus = valor.toUpperCase();
    const regex: RegExp = /^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

    if (!regex.test(valorMayus)) {
      return { validarDni: 'Formato incorrecto: 8 números y 1 letra' };
    }

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(valorMayus.substring(0, 8));
    const letra = valorMayus.substring(8, 9);
    const letraBuena = letras.charAt(numero % 23);

    if (letra !== letraBuena) {
      return { validarDni: 'La letra no coincide. Debería ser ' + letraBuena };
    }
    return null;
  }

  static validarFecha(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    if (!fecha) return null;

    const regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    if (!regex.test(fecha)) return { validarFecha: true };

    const [dia, mes, year] = fecha.split('/').map((v: string) => parseInt(v, 10));

    if (mes < 1 || mes > 12) return { validarFecha: true };

    const esBisiesto = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    // Lógica de días por mes corregida
    if (mes === 2) {
      const maxDia = esBisiesto ? 29 : 28;
      if (dia < 1 || dia > maxDia) return { validarFecha: true };
    } else if ([4, 6, 9, 11].includes(mes)) {
      if (dia < 1 || dia > 30) return { validarFecha: true };
    } else {
      if (dia < 1 || dia > 31) return { validarFecha: true };
    }

    return null;
  }

  static subValidarCP(cadena: string): boolean {
    return !isNaN(Number(cadena)) && cadena.length === 5 && parseInt(cadena.substring(0, 2)) > 0 && parseInt(cadena.substring(0, 2)) < 53;
  }

  static validarCP(codigoPostal: AbstractControl): ValidationErrors | null {
    const cp = codigoPostal.value;
    const formGroup = codigoPostal.parent as FormGroup;

    if (!this.subValidarCP(cp)) {
      if (formGroup) {
        formGroup.get('provincia')?.patchValue('', { emitEvent: false });
      }
      return { validarCP: true };
    }

    const arrayProvincias: string[] = [
      "Álava", "Albacete", "Alicante", "Almería", "Ávila", "Badajoz", "Illes Balears",
      "Barcelona", "Burgos", "Cáceres", "Cádiz", "Castellón", "Ciudad Real", "Córdoba",
      "Coruña", "Cuenca", "Girona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva",
      "Huesca", "Jaén", "León", "Lleida", "La Rioja", "Lugo", "Madrid", "Málaga",
      "Murcia", "Navarra", "Ourense", "Asturias", "Palencia", "Las Palmas", "Pontevedra",
      "Salamanca", "S.C. Tenerife", "Cantabria", "Segovia", "Sevilla", "Soria", "Tarragona",
      "Teruel", "Toledo", "Valencia", "Valladolid", "Bizkaia", "Zamora", "Zaragoza",
      "Ceuta", "Melilla"
    ];

    const prefijo = parseInt(cp.substring(0, 2));
    if (formGroup) {
      const provinciaControl = formGroup.get('provincia');
      const nombreProvincia = arrayProvincias[prefijo - 1];
      if (provinciaControl && provinciaControl.value !== nombreProvincia) {
        provinciaControl.patchValue(nombreProvincia, { emitEvent: false });
      }
    }
    return null;
  }
}
