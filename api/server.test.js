const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const user1 = { username: 'joe', password: '1234' }
const user2 = { username: 'billy', password: '1234' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})


describe('[POST] /register - register new user', () => {
  it('returns a status 201 CREATED', async () => {
    const res = await request(server).post('/api/auth/register').send(user1)
    expect(res.status).toBe(201)
  })
  it('returns a newly created user', async () => {
    const res = await request(server).post('/api/auth/register').send(user1)
    expect(res.body).toMatchObject({ username: 'joe', ...res.body })
  })
})

describe('[POST] /login - login as user', () => {
  it('login succesful with status 200', async () => {
    await request(server).post('/api/auth/register').send(user2)
    const res = await request(server).post('/api/auth/login').send(user2)
    expect(res.status).toBe(200)
  })
  it('responds with the welcome message', async () => {
    await request(server).post('/api/auth/register').send(user2)
    const res = await request(server).post('/api/auth/login').send(user2)
    expect(res.body.message).toBe('welcome, billy')
  })
})
