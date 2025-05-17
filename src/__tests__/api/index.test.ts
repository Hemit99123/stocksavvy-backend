import request from "supertest"
import app from "../../../index.ts";

test('GET index route', async () => {
    await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
});
