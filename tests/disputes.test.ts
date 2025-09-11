import nock from 'nock';
import axios from 'axios';
import { DisputesAPI } from '../src/api/disputes-api';
import { DisputeReason, DisputeStatus, type Dispute, type UpdateDisputeParams } from '../src/types/disputes';

const baseURL = 'https://api.framepayments.com';
const client = axios.create({ baseURL });
const disputes = new DisputesAPI(client);

const mockDispute: Dispute = {
    id: 'dp_123',
    amount: 5000,
    currency: 'usd',
    reason: DisputeReason.FRADULENT,
    status: DisputeStatus.UNDER_REVIEW,
    charge_intent: 'ci_123',
    livemode: false,
    object: 'dispute',
    created: 1720200000,
    updated: 1720200000,
    evidence: {
        customer_name: 'customer'
    }
};

test('get dispute', async () => {
    nock(baseURL)
        .get('/v1/disputes/dp_123')
        .reply(200, mockDispute);

    const result = await disputes.get('dp_123');
    expect(result).toEqual(mockDispute);
});

test('update dispute', async () => {
    const updates: UpdateDisputeParams = {
        submit: true
    };
    const updatedDispute = { ...mockDispute, ...updates };

    nock(baseURL)
        .post('/v1/disputes/dp_123', updates as any)
        .reply(200, updatedDispute);

    const result = await disputes.update('dp_123', updates);
    expect(result).toEqual(updatedDispute);
});

test('list disputes', async () => {
    const response = {
        meta: {
        page: 1,
        has_more: false,
        url: '/v1/disputes',
        prev: null,
        next: null
        },
        data: [mockDispute]
    };

    nock(baseURL)
     .get('/v1/disputes')
     .query(true)
     .reply(200, response);

  const result = await disputes.list(10, 1, undefined, undefined);
    expect(result).toEqual(response);
});

test('close dispute', async () => {
    const closedDispute = { ...mockDispute, status: 'closed' };

    nock(baseURL)
        .post('/v1/disputes/dp_123/close')
        .reply(200, closedDispute);

    const result = await disputes.close('dp_123');
    expect(result).toEqual(closedDispute);
});