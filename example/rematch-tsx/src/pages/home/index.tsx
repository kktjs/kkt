import React, { Component } from 'react';
import { Button } from 'uiw';
import { DefaultProps } from '../../';

export default class Home extends Component<DefaultProps> {
  render() {
    const { history } = this.props;
    return (
      <div>
        首页
        <Button onClick={() => history.push('/login')}>Logout</Button>
      </div>
    );
  }
}
