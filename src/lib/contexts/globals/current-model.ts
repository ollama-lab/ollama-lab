import { candidate, setCandidate } from "./candidate-model";
import { currentSession, reloadCurrentSession } from "./current-session";
import { defaultModel, modelList } from "./model-states";
import { setSessionModel as setSessionModelCommand } from "~/lib/commands/sessions";
import { reloadSession } from "./sessions";

function checkExistence(model: string) {
  return modelList().find((item) => item.name === model);
}

export function getCurrentModel() {
  const sessionModel = currentSession()?.currentModel;
  if (sessionModel && checkExistence(sessionModel)) {
    return sessionModel;
  }

  const candidateModel = candidate();
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

export async function setSessionModel(model: string) {
  const session = currentSession();
  if (!session) {
    setCandidate(model);
    return;
  }

  await setSessionModelCommand(session.id, model);
  await reloadSession(session.id);
  await reloadCurrentSession();
}

export async function resetModelSelection(model: string) {
  const defaultModelReturn = defaultModel();

  if (candidate() === model) {
    setCandidate(null);
  }

  if (currentSession()?.currentModel === model) {
    if (defaultModelReturn) {
      await setSessionModel(defaultModelReturn);
    }
  }
}
