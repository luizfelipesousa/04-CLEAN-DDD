import { expect, it } from 'vitest'
import { Slug } from './slug'

it('should generate a valid slug', () => {
  const slug = Slug.createFromText('An example of- slug!').value
  const slug2 = Slug.createFromText('An Random! text_').value
  expect(slug).toEqual('an-example-of-slug')
  expect(slug2).toEqual('an-random-text')
})
