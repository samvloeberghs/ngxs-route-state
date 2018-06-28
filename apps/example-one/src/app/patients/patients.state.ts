import { Action, State, StateContext, Selector } from '@ngxs/store';

import { Patient } from './patient/patient.model';
import { PatientsPersistenceService } from './patients-persistence.service';
import { SetCurrentPatient, SetCurrentPatientById, SetPatientPart, SetPatients } from './patients.actions';

export interface PatientsStateModel {
  currentPatient: Patient;
  patients: Patient[];
}

export enum PATIENTPART {
  FICHE = 'fiche',
  JOURNAL = 'journal'
}

export interface PatientState {
  selectedPart: PATIENTPART;
}

@State<PatientsStateModel>({
  name: 'PatientsState',
  defaults: {
    currentPatient: undefined,
    patients: []
  }
})
export class PatientsState {

  @Selector()
  static currentPatient(state: PatientsStateModel) {
    return state.currentPatient;
  }

  @Selector()
  static patients(state: PatientsStateModel) {
    return state.patients;
  }

  constructor(private readonly persistenceService: PatientsPersistenceService) {
    console.log('PatientsState init');
  }

  @Action(SetCurrentPatient)
  setCurrentPatient({ getState, patchState, dispatch }: StateContext<PatientsStateModel>, { payload }: SetCurrentPatient) {
    patchState({ currentPatient: payload });
    this.persistenceService.serializeState(payload);
  }

  @Action(SetCurrentPatientById)
  setCurrentPatientById({ getState, patchState, dispatch }: StateContext<PatientsStateModel>, { payload }: SetCurrentPatientById) {
    const currentPatient = getState().patients.find(patient => {
      return payload === patient.id;
    });
    patchState({ currentPatient: currentPatient });
    this.persistenceService.serializeState(currentPatient);
  }

  @Action(SetPatients)
  setPatients({ getState, patchState, dispatch }: StateContext<PatientsStateModel>, { payload }: SetPatients) {
    patchState({ patients: payload });
  }

  @Action(SetPatientPart)
  setPatientPart({ getState, patchState, dispatch }: StateContext<PatientsStateModel>, { payload }: SetPatientPart) {

    const currentPatients = getState().patients;
    const patientIndex = currentPatients.findIndex(patient => {
      return payload.patient.id === patient.id;
    });

    if (patientIndex > -1) {

      const newPatients = [...currentPatients];
      const newPatient = {
        ...currentPatients[patientIndex],
        state: {
          selectedPart: payload.part
        }
      };
      newPatients[patientIndex] = newPatient;
      patchState({ currentPatient: newPatient, patients: newPatients });
      this.persistenceService.serializeState(newPatient);

    }

  }

}
