import {
  getPublishedProjectById,
  getLatestDraft,
  getProjectTemplate,
  isProjectCodeUnique,
  listPublishedProjects,
  publishProject,
  saveProjectDraft,
} from '../services/data-service.mjs';

export function getTemplate(_req, res) {
  res.json(getProjectTemplate());
}

export function validateCode(req, res) {
  const isUnique = isProjectCodeUnique(req.body?.code);
  res.json({ isUnique });
}

export function saveDraft(req, res) {
  const draft = req.body;
  if (!draft || typeof draft !== 'object') {
    res.status(400).json({ message: 'Draft payload is required' });
    return;
  }
  const saved = saveProjectDraft(draft);
  res.json({
    id: 'project-studio-draft',
    version: saved.version,
    savedAt: saved.savedAt,
  });
}

export function getDraft(_req, res) {
  res.json(getLatestDraft());
}

export function publish(req, res) {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ message: 'Project payload is required' });
    return;
  }
  const entity = publishProject(payload);
  res.json({
    id: entity.id,
    code: entity.code,
    savedAt: entity.updatedAt,
  });
}

export function list(_req, res) {
  res.json(listPublishedProjects());
}

export function details(req, res) {
  const entity = getPublishedProjectById(req.params.id);
  if (!entity) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }
  res.json(entity);
}
