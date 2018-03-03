const coolStory = require('.')
const {isPlainObject} = require('lodash')

require('dotenv-safe').load()

test('it is a function', () => {
  expect(typeof coolStory).toBe('function')
})

describe('data', () => {
  let repo
  
  beforeAll(async () => {
    repo = await coolStory('electron/electron')
  })

  test('gets basic repo data', async () => {
    expect(isPlainObject(repo)).toBe(true)
    expect(repo.nameWithOwner).toBe('electron/electron')
    expect(repo.description.length).toBeTruthy()
    expect(repo.descriptionHTML.length).toBeTruthy()
    expect(repo.homepageUrl.length).toBeTruthy()
    expect(repo.createdAt.length).toBeTruthy()
    expect(repo.pushedAt.length).toBeTruthy()
    expect(repo.licenseInfo.name.length).toBeTruthy()
    expect(typeof repo.isFork).toBe('boolean')
    expect(repo.forkCount > -1).toBe(true)
  })

  test('does not include undesireable data returned by the GitHub API', async () => {
    expect(repo.downloads_url).toBe(undefined)
  })
})

describe('error handling', () => {
  test('throws an error with empty input', async () => {
    expect.assertions(1)
    await coolStory().catch(err => {
      expect(err.message).toContain('First argument must be a GitHub repo')
    })
  })
  
  test('throws an error with bad input', async () => {
    expect.assertions(1)
    await coolStory('bad-input').catch(err => {
      expect(err.message).toContain('First argument must be a GitHub repo')
    })
  })
  
  test('throws an error if GH_TOKEN is not found', async () => {
    const oldToken = process.env.GH_TOKEN
    delete process.env.GH_TOKEN
    expect.assertions(1)
    await coolStory('bad-input').catch(err => {
      expect(err.message).toBe('`GH_TOKEN` env var must be set')
      process.env.GH_TOKEN = oldToken
    })
  })
  
  test('handles nonexistent repos', async () => {
    await coolStory('some/nonexistent-repo').catch(err => {
      expect(err.message).toContain('Could not resolve to a Repository')
    })
  })
})