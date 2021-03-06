'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import UserStore from 'stores/User';
import LeaseStore from 'stores/Lease';
import LeaseBytecode from 'utils/LeaseBytecode';
import LeaseABI from 'utils/LeaseABI';
import Web3 from 'web3';
import USDOracleStore from 'stores/USDOracle';
import _ from 'lodash';
import RippleLoader from 'components/RippleLoader';
import Footer from 'components/Footer';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { nextTick } from 'utils/SafeTime';
import SharedStyles from 'src/SharedStyles';

type Props = { };
type State = {
  landlordAddress: string,
  tenantAddress: string,
  cyclePriceUsd: string,
  minCycleCount: number,
  deploying: boolean,
  startDate: any,
  cycleTimeDays: number
};

export default class CreateLeaseCell extends Component<Props, State> {

  dispatchToken: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      landlordAddress: '',
      tenantAddress: '',
      cyclePriceUsd: '',
      minCycleCount: 6,
      deploying: false,
      startDate: moment(),
      cycleTimeDays: 30
    };
  }

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      if (action.type === Action.lease.created) {
        nextTick(() => {
          Dispatcher.dispatch({
            type: Action.router.redirect,
            data: {
              path: `lease/${action.data._address}`
            }
          });
        });
        nextTick(() => this.setState({ deploying: false }));
      } else if (action.type === Action.lease.error) {
        console.log('Error deploying', action.data);
        nextTick(() => this.setState({ deploying: false }));
      } else {
        nextTick(() => this.forceUpdate());
      }
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  handleSubmit(event: any) {
    event.preventDefault();
    Dispatcher.dispatch({
      type: Action.lease.create,
      data: {
        landlordAddress: this.state.landlordAddress,
        tenantAddress: this.state.tenantAddress,
        leaseStartTime: moment(this.state.startDate).unix(),
        leaseCycleTime: 60 * 60 * 24 * this.state.cycleTimeDays,
        leaseCyclePriceUsd: this.state.cyclePriceUsd,
        minCycleCount: this.state.minCycleCount
      }
    });
    this.setState({
      deploying: true
    });
  }

  render() {
    return (
      <div style={SharedStyles.cellContainer}>
        <h2>Create a lease</h2>
        <form
          onSubmit={_.bind(this.handleSubmit, this)}
          style={{ display: this.state.deploying ? 'none' : undefined }}
        >
          <label>Landlord Ethereum Address:</label>
          <input
            type='text'
            value={this.state.landlordAddress}
            onChange={e => this.setState({ landlordAddress: e.target.value })}
            style={styles.textInput}
          />
          <br />
          <label>Tenant Ethereum Address:</label>
          <input
            type='text'
            value={this.state.tenantAddress}
            onChange={e => this.setState({ tenantAddress: e.target.value })}
            style={styles.textInput}
          />
          <br />
          <label>Cycle Time (Days):</label>
          <input
            type='text'
            value={this.state.cycleTimeDays}
            onChange={e => this.setState({ cycleTimeDays: e.target.value })}
            style={styles.textInput}
          />
          <br />
          <label>Cycle Price (USD):</label>
          <input
            type='text'
            value={this.state.cyclePriceUsd}
            onChange={e => this.setState({ cyclePriceUsd: e.target.value })}
            style={styles.textInput}
          />
          <br />
          <label>Minimum Cycle Count:</label>
          <input
            type='text'
            value={this.state.minCycleCount}
            onChange={e => this.setState({ minCycleCount: e.target.value })}
            style={styles.textInput}
          />
          <br />
          <label>Lease Start Date:</label>
          <div style={styles.dateInput}>
            <DatePicker
              selected={this.state.startDate}
              onChange={startDate => this.setState({ startDate })}
            />
          </div>
          <br />
          <input type='submit' value='Deploy Contract' />
        </form>
        <h3 style={{ display: this.state.deploying ? undefined : 'none' }}>
          Your contract is being deployed, you will be automatically redirected in a moment
        </h3>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 'auto',
    padding: 8,
    textAlign: 'center',
    border: '2px solid #000',
    margin: 8,
    borderRadius: 20
  },
  textInput: {
    margin: 4,
    width: '30%'
  },
  dateInput: {
    margin: 4,
    display: 'inline-block'
  }
};
