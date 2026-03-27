import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, of, switchMap, timer, catchError } from 'rxjs';
import { ProjectStudioApiService } from '../../../core/services/project-studio-api.service';

export const projectCodeUniqueValidator = (api: ProjectStudioApiService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    const code = String(control.value ?? '').trim();
    if (code.length < 3) {
      return of(null);
    }

    return timer(250).pipe(
      switchMap(() => api.validateCode(code)),
      map((r) => (r.isUnique ? null : ({ codeTaken: true } as ValidationErrors))),
      catchError(() => of({ codeValidationFailed: true })),
    );
  };
};
