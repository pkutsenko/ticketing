import request from "supertest";
import {app} from "../../app";

describe('current-user', () => {
    it('response with details about current user', async () => {
        const cookie = await signup();

        const response = await request(app)
            .get('/api/users/currentuser')
            .set('Cookie', cookie)
            .send()
            .expect(200)

        expect(response.body.currentUser.email).toEqual('test@test.com')
    })
})
