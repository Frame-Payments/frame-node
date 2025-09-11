/// <reference types="jest" />
import axios from 'axios';
import nock from 'nock';
import { SubscriptionPhasesAPI } from '../src/api/subscription_phases-api';
import { DurationType, PricingType, type SubscriptionPhase, type SubscriptionPhaseListResponse, type UpdateSubscriptionPhaseParams } from '../src/types/subscription_phases';

const baseUrl = 'https://api.framepayments.com';
const client = axios.create({ baseURL: baseUrl });
const api = new SubscriptionPhasesAPI(client);

const subscriptionId = 'sub_123';
const phaseId = 'phase_456';

const mockPhase: SubscriptionPhase = {
    id: phaseId,
    object: 'subscription_phase',
    ordinal: 0,
    pricing_type: PricingType.RELATIVE,
    duration_type: DurationType.FINITE,
    currency: '',
    livemode: false,
    created: 0,
    updated: 0
};

const mockPhaseList: SubscriptionPhaseListResponse = {
    phases: [mockPhase],
    meta: {
        subscription_id: 'sub_123'
    }
};

test('list phases', async () => {
  nock(baseUrl)
    .get(`/v1/subscriptions/${subscriptionId}/phases`)
    .reply(200, mockPhaseList);

  const result = await api.list(subscriptionId);
  expect(result).toEqual(mockPhaseList);
});

test('get single phase', async () => {
  nock(baseUrl)
    .get(`/v1/subscriptions/${subscriptionId}/phases/${phaseId}`)
    .reply(200, mockPhase);

  const result = await api.get(subscriptionId, phaseId);
  expect(result).toEqual(mockPhase);
});

test('create phase', async () => {
  const params = { start_date: 1720000000, end_date: 1720500000 };

  nock(baseUrl)
    .post(`/v1/subscriptions/${subscriptionId}/phases`, params)
    .reply(200, mockPhase);

  const result = await api.create(subscriptionId, params as any);
  expect(result).toEqual(mockPhase);
});

test('update phase', async () => {
  const updateParams: UpdateSubscriptionPhaseParams = {
    name: 'new phase'
  }

  nock(baseUrl)
    .patch(`/v1/subscriptions/${subscriptionId}/phases/${phaseId}`)
    .reply(200, { ...mockPhase, ...updateParams });

  const result = await api.update(subscriptionId, phaseId, updateParams);
  expect(result.name).toEqual(updateParams.name);
});

test('delete phase', async () => {
  nock(baseUrl)
    .delete(`/v1/subscriptions/${subscriptionId}/phases/${phaseId}`)
    .reply(200, { id: phaseId, object: 'subscription_phase', deleted: true });

  const result = await api.delete(subscriptionId, phaseId);
  expect(result).toEqual({ id: phaseId, object: 'subscription_phase', deleted: true });
});

test('bulk update phases', async () => {
  const bulkPhases = [{ id: phaseId, metadata: { bulk: true } }];

  nock(baseUrl)
    .patch(`/v1/subscriptions/${subscriptionId}/phases/bulk_update`, { phases: bulkPhases })
    .reply(200, mockPhaseList);

  const result = await api.bulkUpdate(subscriptionId, bulkPhases);
  expect(result).toEqual(mockPhaseList);
});