import { getCandidate, setCandidate } from "./candidate-model";
import { currentSession, deselectModel, reloadCurrentSession } from "./current-session";
import { defaultModel, modelList } from "./model-states";
import { setSessionModel as setSessionModelCommand } from "~/lib/commands/sessions";
import { reloadSession } from "./sessions";
import { SessionMode } from "~/lib/schemas/session";

function checkExistence(model: string) {
  return modelList().find((item) => item.name === model);
}

export function getCurrentModel(mode: SessionMode) {
  const sessionModel = currentSession(mode)?.currentModel;
  if (sessionModel && checkExistence(sessionModel)) {
    return sessionModel;
  }

  const candidateModel = getCandidate(mode);
  if (candidateModel && checkExistence(candidateModel)) {
    return candidateModel;
  }

  const defaultModelReturn = defaultModel();
  if (defaultModelReturn && checkExistence(defaultModelReturn)) {
    return defaultModelReturn;
  }

  const firstModel = modelList().at(0)?.name;
  if (firstModel) {
    return firstModel;
  }

  return null;
}

export async function setSessionModel(model: string, mode: SessionMode) {
  const session = currentSession(mode);
  if (!session) {
    setCandidate(mode, model);
    return;
  }

  await setSessionModelCommand(session.id, model);
  await reloadSession(session.id, mode);
  await reloadCurrentSession(mode);
}

export async function resetModelSelection(model: string) {
  const defaultModelReturn = defaultModel();

  if (defaultModelReturn) {
    await deselectModel(model, defaultModelReturn);
  }
}
