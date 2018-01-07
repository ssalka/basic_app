import * as _ from 'lodash';
import { createTestDocs, removeTestDocs } from 'test/utils';
import { Entity, EntityEvent, User } from 'lib/server/models';
import { MockUser } from 'lib/server/models/mocks';
import { MongoCollection } from 'lib/common/constants';
import {
  EntityDocument,
  EntityEventType,
  IEvent,
  ICreateEntityPayload
} from 'lib/common/interfaces';

describe('EntityEvent', () => {
  const testUser = new MockUser();

  beforeAll(async done => {
    await User.create(testUser).catch(done.fail);
    done();
  });

  afterAll(async done => {
    await User.remove(testUser).catch(done.fail);
    done();
  });

  const testEntity = new Entity({
    name: 'Test Entity',
    references: [
      {
        model: MongoCollection.User,
        value: testUser
      }
    ]
  });

  const testEvent: IEvent<ICreateEntityPayload> = {
    type: EntityEventType.Created,
    creator: testUser._id,
    payload: {
      entity: testEntity.toObject()
    }
  };

  describe('#create', () => {
    afterEach(done => EntityEvent.remove({}, done));

    it('Creates documents with the intended structure', async () => {
      const { createdAt, type, _model, payload } = await EntityEvent.create(testEvent);

      expect(_model).toBe(MongoCollection.EntityEvent);
      expect(type).toBe(testEvent.type);

      const resolution = 10000;
      expect(createdAt.valueOf() / resolution).toBeCloseTo(
        new Date().valueOf() / resolution
      );

      const missingEntityKeys = _.differenceBy(
        new Entity().toObject(),
        payload.entity,
        _.keys
      );
      expect(missingEntityKeys).toHaveLength(0);

      // BUG: subdocs are not populated
      // expect(payload.entity).toEqual(testEntity);

      expect(payload.entity.references).toHaveLength(1);

      const [{ model, value }] = payload.entity.references;
      expect(model).toBe(MongoCollection.User);
      expect(value).toEqual(testUser._id);
    });
  });

  describe('#project', () => {
    let entityEvents: EntityDocument[];
    const testEntities = [1, 2, 3].map(i => ({
      type: EntityEventType.Created,
      creator: testUser._id,
      payload: {
        entity: {
          name: `Entity ${i}`
        }
      }
    }));

    beforeAll(async done => {
      const results = await createTestDocs({
        EntityEvent: testEntities
      }).catch(done.fail);

      entityEvents = results.EntityEvent;

      done();
    });

    afterAll(removeTestDocs);

    it("creates a projection of the user's entities", async done => {
      const entities: EntityDocument[] = await EntityEvent.project({
        creator: testUser._id.toString()
      }).catch(done.fail);

      expect(entities.map(e => e.name)).toEqual(['Entity 1', 'Entity 2', 'Entity 3']);
      done();
    });
  });
});
