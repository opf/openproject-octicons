import * as Octicons from '../'

describe('@openproject/octicons-react', () => {
  it('should not update exports without a semver change', () => {
    expect(Object.keys(Octicons).sort()).toMatchSnapshot()
  })
})
