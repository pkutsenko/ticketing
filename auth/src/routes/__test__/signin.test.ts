import request from "supertest";
import {app} from "../../app";

beforeEach(async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201)
})

describe('signin', () => {
    it('returns a 200 on successful signin', async () => {
        return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(200)
    })

    it('fails when email doesn\'t exist', async () => {
        return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test1@test.com',
                password: 'password',
            })
            .expect(400)
    })

    it('returns a 400 with an invalid email', async () => {
        return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test.com',
                password: 'password',
            })
            .expect(400)
    })

    it('returns a 400 with an invalid password', async () => {
        return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'pas',
            })
            .expect(400)
    })

    it('returns a 400 with missing email and password', async () => {
        return request(app)
            .post('/api/users/signin')
            .send({})
            .expect(400)
    })

    it('sets a cookie after successful signin', async () => {
        const response = await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(200)

        expect(response.get('Set-Cookie')).toBeDefined()
    })
})
