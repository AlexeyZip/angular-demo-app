import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value as string | undefined;
    const endDate = control.get('endDate')?.value as string | undefined;

    if (!startDate || !endDate) {
      return null;
    }

    const startTs = Date.parse(startDate);
    const endTs = Date.parse(endDate);

    if (Number.isNaN(startTs) || Number.isNaN(endTs)) {
      return { invalidDate: true };
    }

    if (endTs < startTs) {
      return { dateRange: true };
    }

    return null;
  };
};
