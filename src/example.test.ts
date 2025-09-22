import { Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/sqlite";

@Entity()
class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ":memory:",
    entities: [User],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test("basic CRUD example", async () => {
  const createdUser = orm.em.create(User, { name: "Jon" });
  await orm.em.flush();
  orm.em.clear();

  const jon = await orm.em.findOneOrFail(User, { name: "Jon" });
  jon.name = "123";
  await orm.em.flush();

  await orm.em.refresh(createdUser);
  // console.log("👀", createdUser.name);
  expect(createdUser.name).toBe("123");
});
