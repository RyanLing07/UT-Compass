//this code is a short validation to ensure whatever all of the information is filled and works.
//it validates title, item, location block to ensure it works.
export const MAX_TITLE_LENGTH = 30; // enough for "Computer Architecture" (22 chars) plus a little room

export function validateTitle(title) {
  const trimmed = (title ?? "").trim();
  if (trimmed.length === 0) return "Give this a title";
  return null;
}

// A location only counts as "real" if its building ID actually exists in
// the buildings dataset building only ever gets set via
// BuildingAutocomplete's onSelect, so this blocks all the text next clicked options.
export function validateLocationBlock(loc, buildings) {
  const errors = {};

  const isRealBuilding =
    loc.building && buildings.some((b) => b.id === loc.building);
  if (!isRealBuilding) {
    errors.building = "Search and select a real building!";
  }

  if (loc.hasTime) {
    if (!loc.days || loc.days.length === 0) {
      errors.days = "Pick at least one day!";
    }
    if (!loc.start || !loc.end) {
      errors.time = "Set both a start and end time!";
    }
  }

  return errors; // empty object == valid
}

export function validateItem({ title, locations }, buildings) {
  const titleError = validateTitle(title);
  const locationErrors = locations.map((loc) =>
    validateLocationBlock(loc, buildings),
  );
  const hasLocationError = locationErrors.some(
    (e) => Object.keys(e).length > 0,
  );

  return {
    valid: !titleError && !hasLocationError,
    titleError,
    locationErrors,
  };
}
