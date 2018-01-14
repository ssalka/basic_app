import * as _ from 'lodash';
import * as uuid from 'uuid/v4';
import { createTestDocs, removeTestDocs } from 'test/utils';
import { Entity, EntityCreated, Event, User } from 'lib/server/models';
import { MockUser } from 'lib/server/models/mocks';
import { MongoCollection } from 'lib/common/constants';
import {
  EntityDocument,
  EventType,
  IEvent,
  ICreateEntityPayload,
  IEvent2
} from 'lib/common/interfaces';

describe('Entity Events', () => {
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
    _id: uuid(),
    name: 'Test Entity'
  }).toObject();

  const testEvent: IEvent2 & ICreateEntityPayload = {
    user: testUser._id,
    entity: testEntity._id,
    newEntity: testEntity,
    timestamp: new Date(),
    version: 0
  };

  describe('#create', () => {
    afterEach(done => EntityCreated.remove({}, done));

    it('Creates documents with the intended structure', async () => {
      const now = Date.now();
      const { createdAt, type, newEntity } = await EntityCreated.create(testEvent);

      expect(createdAt).toBeInstanceOf(Date);
      expect(type).toBe(EventType.EntityCreated);

      const resolution = 100000;
      expect(createdAt.valueOf() / resolution).toBeCloseTo(now / resolution);

      const missingEntityKeys = _.differenceBy(
        new Entity().toObject(),
        newEntity,
        _.keys
      );
      expect(missingEntityKeys).toHaveLength(0);

      // BUG: subdocs are not populated

      expect(_.pick(newEntity.toObject(), _.keys(testEntity))).toEqual(testEntity);
    });
  });

  describe('#project', () => {
    let events: IEvent2[];
    const testEntities = [1, 2, 3].map(i => ({
      user: testUser._id,
      entity: testEntity._id,
      newEntity: {
        ...testEntity,
        name: `Entity ${i}`
      },
      timestamp: new Date(),
      version: 0
    }));

    beforeAll(async done => {
      const results = await createTestDocs({
        EntityCreated: testEntities
      }).catch(done.fail);

      events = results.EntityCreated;

      done();
    });

    afterAll(removeTestDocs);

    it("creates a projection of the user's entities", async done => {
      const entities: EntityDocument[] = await Event.project({
        user: testUser._id.toString()
      }).catch(done.fail);

      expect(entities.map(e => e.name)).toEqual(['Entity 1', 'Entity 2', 'Entity 3']);
      done();
    });
  });
});
