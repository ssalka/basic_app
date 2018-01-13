import { entity as entityMiddleware } from 'lib/server/middleware';
import { Entity, EntityCreated, EntityRenamed } from 'lib/server/models';
import { MockUser } from 'lib/server/models/mocks';

describe('Entity Middleware', () => {
  let req: Record<string, any>;
  let res: Record<string, any>;
  let next: (err?) => void;

  const testEntity = new Entity({
    name: 'Test Entity'
  }).toObject();

  beforeEach(() => {
    req = {
      user: new MockUser()
    };
    res = {};
  });

  beforeEach(() => {
    req.body = { entity: testEntity };
    res.json = jest.fn();
    next = jest.fn();
  });

  describe('#createEntity', () => {
    let EntityCreatedMock = EntityCreated;

    afterEach(() => (EntityCreatedMock = EntityCreated));

    it('creates an EntityCreated event', async () => {
      EntityCreatedMock.create = jest.fn(() =>
        Promise.resolve({
          entity: testEntity
        })
      );

      await entityMiddleware.createEntity(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('#renameEntity', () => {
    let EntityRenamedMock = EntityRenamed;

    beforeEach(() => {
      req.params = { entityId: 'entityId' };
    });

    afterEach(() => (EntityRenamedMock = EntityRenamed));

    it('creates an EntityRenamed event', async () => {
      EntityRenamedMock.create = jest.fn(() =>
        Promise.resolve({
          entity: testEntity
        })
      );

      await entityMiddleware.renameEntity(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
