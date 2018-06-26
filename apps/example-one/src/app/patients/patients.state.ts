import { Action, State, StateContext } from '@ngxs/store';

import { Patient } from './patient/patient.model';
import { PersistanceService } from './persistance.service';
import { SetCurrentPatientIdAction, SetPatientsAction } from './patients.actions';

export interface PatientsStateModel {
  currentPatientId: number;
  patients: Patient[];
}

export interface PatientState {
  checked: boolean;
}

@State<PatientsStateModel>({
  name: 'PatientsState',
  defaults: {
    currentPatientId: 0,
    patients: []
  }
})
export class PatientsState {

  constructor(private readonly persistanceService: PersistanceService) {
    console.log('PatientsState init');
  }

  @Action(SetCurrentPatientIdAction)
  setCurrentPatientId({ getState, patchState, dispatch }: StateContext<PatientsStateModel>, { payload }: SetCurrentPatientIdAction) {
    patchState({ currentPatientId: payload });
    this.persistanceService.serializeState(payload);
  }

  @Action(SetPatientsAction)
  setPatients({ getState, patchState, dispatch }: StateContext<PatientsStateModel>, { payload }: SetPatientsAction) {
    patchState({ patients: payload });
  }

}