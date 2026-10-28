// Fixture used by test_file_loader_test.js: a TypeScript module that imports a sibling module via a relative path.
import { dependencyMarker } from './loader_fixture_dependency.ts';

export const importedMarker: string = dependencyMarker;
