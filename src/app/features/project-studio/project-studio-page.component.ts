import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UiButtonComponent, UiInputComponent, UiTextareaComponent } from 'ui';
import { ProjectFormValue, ProjectStudioApiService } from '../../core/services/project-studio-api.service';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { ProjectStudioFacade } from './state/project-studio.facade';
import { dateRangeValidator } from './validators/date-range.validator';
import { projectCodeUniqueValidator } from './validators/project-code-unique.validator';

type StakeholderGroup = FormGroup<{
  name: FormControl<string>;
  role: FormControl<string>;
  email: FormControl<string>;
}>;

type MilestoneGroup = FormGroup<{
  title: FormControl<string>;
  dueDate: FormControl<string>;
  done: FormControl<boolean>;
}>;

type ProjectStudioForm = FormGroup<{
  name: FormControl<string>;
  code: FormControl<string>;
  description: FormControl<string>;
  budget: FormControl<string>;
  riskLevel: FormControl<'low' | 'medium' | 'high' | 'critical'>;
  requiresComplianceReview: FormControl<boolean>;
  schedule: FormGroup<{
    startDate: FormControl<string>;
    endDate: FormControl<string>;
  }>;
  stakeholders: FormArray<StakeholderGroup>;
  milestones: FormArray<MilestoneGroup>;
  channels: FormGroup<{
    email: FormControl<boolean>;
    sms: FormControl<boolean>;
    slack: FormControl<boolean>;
  }>;
}>;

@Component({
  selector: 'app-project-studio-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    I18nPipe,
    UiInputComponent,
    UiTextareaComponent,
    UiButtonComponent,
  ],
  templateUrl: './project-studio-page.component.html',
  styleUrl: './project-studio-page.component.scss',
})
export class ProjectStudioPageComponent {
  readonly facade = inject(ProjectStudioFacade);
  private readonly api = inject(ProjectStudioApiService);
  private readonly i18n = inject(I18nService);
  readonly validationIssues = signal<string[]>([]);

  readonly form: ProjectStudioForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{3,20}$/)],
      asyncValidators: [projectCodeUniqueValidator(this.api)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(20)] }),
    budget: new FormControl('0', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(5)],
    }),
    riskLevel: new FormControl<'low' | 'medium' | 'high' | 'critical'>('medium', { nonNullable: true }),
    requiresComplianceReview: new FormControl(false, { nonNullable: true }),
    schedule: new FormGroup(
      {
        startDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        endDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      },
      { validators: [dateRangeValidator()] },
    ),
    stakeholders: new FormArray<StakeholderGroup>([]),
    milestones: new FormArray<MilestoneGroup>([]),
    channels: new FormGroup({
      email: new FormControl(true, { nonNullable: true }),
      sms: new FormControl(false, { nonNullable: true }),
      slack: new FormControl(true, { nonNullable: true }),
    }),
  });

  readonly draftSig = toSignal(this.facade.draft$, { initialValue: null });

  constructor() {
    this.facade.enter();

    this.form.controls.code.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const normalized = value.toUpperCase();
        if (value !== normalized) {
          this.form.controls.code.setValue(normalized, { emitEvent: false });
        }
      });

    this.form.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed())
      .subscribe(() => this.facade.draftChanged(this.toFormValue(), this.form.valid));

    effect(() => {
      const draft = this.draftSig();
      if (!draft || this.form.dirty) {
        return;
      }
      this.patchForm(draft);
    });
  }

  get stakeholders(): FormArray<StakeholderGroup> {
    return this.form.controls.stakeholders;
  }

  get milestones(): FormArray<MilestoneGroup> {
    return this.form.controls.milestones;
  }

  addStakeholder(): void {
    this.stakeholders.push(this.createStakeholderGroup());
  }

  removeStakeholder(index: number): void {
    this.stakeholders.removeAt(index);
  }

  addMilestone(): void {
    this.milestones.push(this.createMilestoneGroup());
  }

  removeMilestone(index: number): void {
    this.milestones.removeAt(index);
  }

  saveNow(): void {
    this.submitWith((value) => this.facade.saveNow(value));
  }

  publishNow(): void {
    this.submitWith((value) => this.facade.publish(value));
  }

  showControlError(control: AbstractControl, key: string): boolean {
    return control.touched && control.hasError(key);
  }

  private submitWith(action: (value: ProjectFormValue) => void): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.validationIssues.set(this.collectValidationIssues());
      return;
    }
    this.validationIssues.set([]);
    action(this.toFormValue());
  }

  private patchForm(value: ProjectFormValue): void {
    this.form.patchValue(
      {
        name: value.name,
        code: value.code,
        description: value.description,
        budget: String(value.budget),
        riskLevel: value.riskLevel,
        requiresComplianceReview: value.requiresComplianceReview,
        schedule: value.schedule,
        channels: value.channels,
      },
      { emitEvent: false },
    );

    this.replaceStakeholders(value.stakeholders);
    this.replaceMilestones(value.milestones);
  }

  private replaceStakeholders(items: ProjectFormValue['stakeholders']): void {
    while (this.stakeholders.length) {
      this.stakeholders.removeAt(0);
    }
    for (const s of items) {
      this.stakeholders.push(this.createStakeholderGroup(s), { emitEvent: false });
    }
  }

  private replaceMilestones(items: ProjectFormValue['milestones']): void {
    while (this.milestones.length) {
      this.milestones.removeAt(0);
    }
    for (const m of items) {
      this.milestones.push(this.createMilestoneGroup(m), { emitEvent: false });
    }
  }

  private createStakeholderGroup(
    value: ProjectFormValue['stakeholders'][number] = { name: '', role: '', email: '' },
  ): StakeholderGroup {
    return new FormGroup({
      name: new FormControl(value.name, { nonNullable: true, validators: [Validators.required] }),
      role: new FormControl(value.role, { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl(value.email, {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  private createMilestoneGroup(
    value: ProjectFormValue['milestones'][number] = { title: '', dueDate: '', done: false },
  ): MilestoneGroup {
    return new FormGroup({
      title: new FormControl(value.title, { nonNullable: true, validators: [Validators.required] }),
      dueDate: new FormControl(value.dueDate, { nonNullable: true, validators: [Validators.required] }),
      done: new FormControl(value.done, { nonNullable: true }),
    });
  }

  private toFormValue(): ProjectFormValue {
    const raw = this.form.getRawValue();
    return {
      ...raw,
      budget: Number(raw.budget) || 0,
    };
  }

  private collectValidationIssues(): string[] {
    const issues: string[] = [];

    if (this.form.controls.name.invalid) {
      issues.push(this.i18n.translate('projectStudio.validation.nameMin'));
    }
    if (this.form.controls.code.hasError('required')) {
      issues.push(this.i18n.translate('projectStudio.validation.codeRequired'));
    } else if (this.form.controls.code.hasError('pattern')) {
      issues.push(this.i18n.translate('projectStudio.validation.codeFormat'));
    } else if (this.form.controls.code.hasError('codeTaken')) {
      issues.push(this.i18n.translate('projectStudio.validation.codeTaken'));
    } else if (this.form.controls.code.hasError('codeValidationFailed')) {
      issues.push(this.i18n.translate('projectStudio.validation.codeCheck'));
    }
    if (this.form.controls.description.invalid) {
      issues.push(this.i18n.translate('projectStudio.validation.descriptionMin'));
    }
    if (this.form.controls.budget.invalid) {
      issues.push(this.i18n.translate('projectStudio.validation.budgetMin'));
    }
    if (this.form.controls.schedule.hasError('dateRange')) {
      issues.push(this.i18n.translate('projectStudio.validation.dateRange'));
    }

    this.stakeholders.controls.forEach((g, i) => {
      if (g.invalid) {
        issues.push(this.i18n.translate('projectStudio.validation.stakeholder', { index: i + 1 }));
      }
    });
    this.milestones.controls.forEach((g, i) => {
      if (g.invalid) {
        issues.push(this.i18n.translate('projectStudio.validation.milestone', { index: i + 1 }));
      }
    });

    return issues;
  }
}
