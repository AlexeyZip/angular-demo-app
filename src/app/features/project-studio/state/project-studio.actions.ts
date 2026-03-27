import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ProjectFormValue,
  PublishProjectResponse,
  SaveDraftResponse,
} from '../../../core/services/project-studio-api.service';

export const ProjectStudioActions = createActionGroup({
  source: 'Project Studio',
  events: {
    Enter: emptyProps(),
    'Load Template': emptyProps(),
    'Load Template Success': props<{ template: ProjectFormValue }>(),
    'Load Template Failure': props<{ message: string }>(),
    'Draft Changed': props<{ draft: ProjectFormValue; isValid: boolean }>(),
    'Save Draft': props<{ draft: ProjectFormValue }>(),
    'Save Draft Success': props<{ payload: SaveDraftResponse }>(),
    'Save Draft Failure': props<{ message: string }>(),
    'Manual Save Requested': props<{ draft: ProjectFormValue }>(),
    'Publish Requested': props<{ draft: ProjectFormValue }>(),
    Publish: props<{ draft: ProjectFormValue }>(),
    'Publish Success': props<{ payload: PublishProjectResponse }>(),
    'Publish Failure': props<{ message: string }>(),
  },
});
