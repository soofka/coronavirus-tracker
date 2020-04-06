import * as constants from '../constants';

describe('constants.js', () => {
  it('did not change', () => {
    expect(constants).toMatchSnapshot();
  });
});
