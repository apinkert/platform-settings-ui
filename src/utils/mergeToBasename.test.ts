import { mergeToBasename } from './mergeToBasename';

describe('mergeToBasename', () => {
  const basename = '/settings';

  describe('with empty basename', () => {
    it('returns string path unchanged', () => {
      expect(mergeToBasename('/roles', '')).toBe('/roles');
    });

    it('returns Location object unchanged', () => {
      expect(mergeToBasename({ pathname: '/roles' }, '')).toEqual({
        pathname: '/roles',
      });
    });
  });

  describe('with string paths', () => {
    it('prepends basename to absolute path', () => {
      expect(mergeToBasename('/roles', basename)).toBe('/settings/roles');
    });

    it('prepends basename to relative path', () => {
      expect(mergeToBasename('roles', basename)).toBe('/settings/roles');
    });

    it('prepends basename to root path', () => {
      expect(mergeToBasename('/', basename)).toBe('/settings/');
    });

    it('does not double-prepend if already prefixed', () => {
      expect(mergeToBasename('/settings/roles', basename)).toBe(
        '/settings/roles',
      );
    });

    it('handles nested paths', () => {
      expect(mergeToBasename('/roles/uuid-123/edit', basename)).toBe(
        '/settings/roles/uuid-123/edit',
      );
    });
  });

  describe('with Location objects', () => {
    it('prepends basename to pathname', () => {
      expect(mergeToBasename({ pathname: '/roles' }, basename)).toEqual({
        pathname: '/settings/roles',
      });
    });

    it('preserves search and hash', () => {
      expect(
        mergeToBasename(
          { pathname: '/roles', search: '?q=admin', hash: '#top' },
          basename,
        ),
      ).toEqual({
        pathname: '/settings/roles',
        search: '?q=admin',
        hash: '#top',
      });
    });

    it('does not double-prepend if already prefixed', () => {
      expect(
        mergeToBasename({ pathname: '/settings/roles' }, basename),
      ).toEqual({ pathname: '/settings/roles' });
    });

    it('handles nested paths', () => {
      expect(
        mergeToBasename({ pathname: '/roles/uuid-123/edit' }, basename),
      ).toEqual({ pathname: '/settings/roles/uuid-123/edit' });
    });

    it('returns Location unchanged when pathname is missing', () => {
      expect(mergeToBasename({ search: '?q=admin' }, basename)).toEqual({
        search: '?q=admin',
      });
    });
  });
});
