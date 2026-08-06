import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

const FEATURE_FLAG = 'platform.settings.redesign';
const HREF_PREFIX = '/settings';
const YAML_PATH = resolve(import.meta.dirname, '..', 'deploy', 'frontend.yaml');

interface Permission {
  method: string;
  args?: unknown[];
}

interface NavItem {
  id: string;
  title: string;
  href?: string;
  permissions?: Permission[];
  navItems?: NavItem[];
  routes?: NavItem[];
}

interface SearchEntry {
  id: string;
  title: string;
  href: string;
  description: string;
  permissions?: Permission[];
}

interface ServiceTile {
  section: string;
  group: string;
  id: string;
  href: string;
  title: string;
  description: string;
  icon: string;
  permissions?: Permission[];
}

interface ModuleRoute {
  pathname: string;
}

interface FrontendSpec {
  module: {
    modules: { routes: ModuleRoute[] }[];
  };
  bundleSegments: {
    segmentId: string;
    bundleId: string;
    position: number;
    navItems: NavItem[];
  }[];
  searchEntries?: SearchEntry[];
  serviceTiles?: ServiceTile[];
}

const errors: string[] = [];

function error(msg: string) {
  errors.push(msg);
}

function hasFeatureFlag(permissions: Permission[] | undefined, label: string) {
  if (!permissions || permissions.length === 0) {
    error(`${label}: missing featureFlag permission (expected ${FEATURE_FLAG})`);
    return;
  }

  const hasFlag = permissions.some(
    (p) =>
      p.method === 'featureFlag' &&
      Array.isArray(p.args) &&
      p.args[0] === FEATURE_FLAG &&
      p.args[1] === true
  );

  if (!hasFlag) {
    error(`${label}: missing featureFlag permission for "${FEATURE_FLAG}" with value true`);
  }
}

const raw = readFileSync(YAML_PATH, 'utf-8');
const doc = parse(raw);

const spec: FrontendSpec | undefined = doc?.objects?.[0]?.spec;
if (!spec) {
  console.error('FAIL: Could not find objects[0].spec in frontend.yaml');
  process.exit(1);
}

const registeredRoutes = new Set(
  spec.module.modules.flatMap((m) => m.routes.map((r) => r.pathname))
);

const allIds = new Set<string>();

function checkDuplicateId(id: string, label: string) {
  if (allIds.has(id)) {
    error(`${label}: duplicate id "${id}"`);
  }
  allIds.add(id);
}

// Validate nav items
for (const segment of spec.bundleSegments) {
  const walkNavItems = (items: NavItem[], parentLabel: string) => {
    for (const item of items) {
      const label = `navItem "${item.id}" (${parentLabel})`;

      if (!item.id) error(`${label}: missing required field "id"`);
      if (!item.title) error(`${label}: missing required field "title"`);
      checkDuplicateId(item.id, label);

      if (item.href) {
        if (!item.href.startsWith(HREF_PREFIX)) {
          error(`${label}: href "${item.href}" does not start with "${HREF_PREFIX}"`);
        }
        if (!registeredRoutes.has(item.href)) {
          error(`${label}: href "${item.href}" has no matching module route`);
        }
      }

      hasFeatureFlag(item.permissions, label);

      if (item.navItems) walkNavItems(item.navItems, label);
      if (item.routes) walkNavItems(item.routes, label);
    }
  };

  walkNavItems(segment.navItems, `segment "${segment.segmentId}"`);
}

// Validate search entries
for (const entry of spec.searchEntries ?? []) {
  const label = `searchEntry "${entry.id}"`;

  if (!entry.id) error(`${label}: missing required field "id"`);
  if (!entry.title) error(`${label}: missing required field "title"`);
  if (!entry.href) error(`${label}: missing required field "href"`);
  if (!entry.description) error(`${label}: missing required field "description"`);
  checkDuplicateId(entry.id, label);

  if (entry.href && !entry.href.startsWith(HREF_PREFIX)) {
    error(`${label}: href "${entry.href}" does not start with "${HREF_PREFIX}"`);
  }
  if (entry.href && !registeredRoutes.has(entry.href)) {
    error(`${label}: href "${entry.href}" has no matching module route`);
  }

  hasFeatureFlag(entry.permissions, label);
}

// Validate service tiles
const tileRequiredFields = ['section', 'group', 'id', 'href', 'title', 'description', 'icon'] as const;

for (const tile of spec.serviceTiles ?? []) {
  const label = `serviceTile "${tile.id}"`;

  for (const field of tileRequiredFields) {
    if (!tile[field]) error(`${label}: missing required field "${field}"`);
  }
  checkDuplicateId(tile.id, label);

  if (tile.href && !tile.href.startsWith(HREF_PREFIX)) {
    error(`${label}: href "${tile.href}" does not start with "${HREF_PREFIX}"`);
  }
  if (tile.href && !registeredRoutes.has(tile.href)) {
    error(`${label}: href "${tile.href}" has no matching module route`);
  }

  hasFeatureFlag(tile.permissions, label);
}

// Report results
if (errors.length > 0) {
  console.error(`\nFrontend YAML validation failed with ${errors.length} error(s):\n`);
  for (const err of errors) {
    console.error(`  ✘ ${err}`);
  }
  console.error('');
  process.exit(1);
} else {
  console.log('✔ Frontend YAML validation passed');
}
