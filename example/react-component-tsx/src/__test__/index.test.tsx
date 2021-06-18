/* eslint-disable jest/no-conditional-expect */
import TestRenderer from 'react-test-renderer';
import Button from '../';

it('Should output a button', async () => {
  const component = TestRenderer.create(<Button type="primary">Primary</Button>);
  let tree = component.toJSON();
  if (tree && !Array.isArray(tree)) {
    expect(tree.type).toEqual('button');
    expect(tree.props.disabled).toBeFalsy();
    expect(tree.props.className).toEqual('w-btn w-btn-default w-btn-primary');
  }
});
