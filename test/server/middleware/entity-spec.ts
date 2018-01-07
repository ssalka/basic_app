import { entity as entityMiddleware } from 'lib/server/middleware';
import { EntityEvent as EntityEventModel } from 'lib/server/models';
import { MockUser } from 'lib/server/models/mocks';

describe('Entity Middleware', () => {
  let req: Record<string, any>;
  let res: Record<string, any>;
  let next: (err?) => void;
  let EntityEvent;

  const testEntity = {
    name: 'Test Entity'
  };

  beforeEach(() => {
    req = {
      user: new MockUser()
    };
    res = {};
  });

  describe('#createEntity', () => {
    beforeEach(() => {
      EntityEvent = EntityEventModel;
      req.body = testEntity;
      res.json = jest.fn();
      next = jest.fn();
    });

    it('creates an EntityEvent detailing the entity created', async () => {
      EntityEvent.create = jest.fn(() =>
        Promise.resolve({
          payload: { entity: testEntity }
        })
      );

      await entityMiddleware.createEntity(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
